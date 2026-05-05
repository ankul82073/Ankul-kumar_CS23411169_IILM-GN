"""
Advershield AI – Backend API
Real-Time Adversarial Attack Detection & AI Trust Platform
"""

import io
import base64
import time
import math
import random
import logging
from datetime import datetime, timedelta
from typing import Optional, List

import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Advershield AI API",
    description="Real-Time Adversarial Attack Detection & AI Trust Platform",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory analytics store (resets on restart – perfect for demo)
# ---------------------------------------------------------------------------
analytics_store = {
    "total_analyzed": 12842,
    "attacks_detected": 438,
    "clean_images": 12404,
    "simulations_run": 1547,
    "history": [],          # last 50 detection events
    "daily_volume": [],     # last-7-day bar data
    "attack_distribution": {
        "FGSM": 48,
        "PGD": 31,
        "DeepFool": 12,
        "CW": 7,
        "JSMA": 2,
    },
}

# Seed some history
_now = datetime.utcnow()
for i in range(30):
    dt = _now - timedelta(minutes=random.randint(1, 1440))
    is_adv = random.random() < 0.04
    analytics_store["history"].append({
        "id": f"scan-{i:04d}",
        "timestamp": dt.isoformat(),
        "filename": f"sample_{i:03d}.jpg",
        "is_adversarial": is_adv,
        "attack_type": random.choice(["FGSM", "PGD", "DeepFool"]) if is_adv else "None",
        "confidence": round(random.uniform(87, 99.9), 2),
        "risk": "High" if is_adv else "Low",
    })

# Seed daily volume
days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
for d in days:
    analytics_store["daily_volume"].append({
        "day": d,
        "normal": random.randint(280, 900),
        "attack": random.randint(5, 110),
    })

# ---------------------------------------------------------------------------
# Helper: image → numpy array
# ---------------------------------------------------------------------------
def _load_image(data: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(data)).convert("RGB").resize((224, 224))
    return np.array(img, dtype=np.float32) / 255.0


def _array_to_b64(arr: np.ndarray) -> str:
    clipped = np.clip(arr * 255, 0, 255).astype(np.uint8)
    img = Image.fromarray(clipped)
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=92)
    return base64.b64encode(buf.getvalue()).decode()


# ---------------------------------------------------------------------------
# Detection logic (deterministic heuristic – no GPU needed)
# ---------------------------------------------------------------------------
def _detect_adversarial(arr: np.ndarray):
    """
    Heuristic detector using gradient variance, high-frequency energy,
    and local-texture entropy.  Returns (is_adversarial, confidence, metrics).
    """
    # 1. High-frequency energy via Laplacian approximation
    def laplacian_var(channel):
        from scipy.ndimage import laplace
        return float(np.var(laplace(channel)))

    from scipy.ndimage import laplace
    lap_vars = [laplacian_var(arr[:, :, c]) for c in range(3)]
    hf_energy = float(np.mean(lap_vars))

    # 2. Pixel-level gradient magnitude
    gx = np.diff(arr, axis=1)
    gy = np.diff(arr, axis=0)
    grad_mag = float(np.mean(np.abs(gx)) + np.mean(np.abs(gy)))

    # 3. Local std dev (texture measure)
    from scipy.ndimage import uniform_filter
    mean_sq = uniform_filter(arr ** 2, size=5)
    sq_mean = uniform_filter(arr, size=5) ** 2
    local_std = float(np.mean(np.sqrt(np.maximum(mean_sq - sq_mean, 0))))

    # 4. Color channel correlation asymmetry
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    corr_rg = float(np.corrcoef(r.flatten(), g.flatten())[0, 1])
    corr_rb = float(np.corrcoef(r.flatten(), b.flatten())[0, 1])
    asymmetry = abs(corr_rg - corr_rb)

    # Thresholds (empirically tuned for JPEG natural images)
    hf_thresh = 0.0008
    grad_thresh = 0.025
    std_thresh = 0.18
    asym_thresh = 0.25

    score = 0.0
    score += min(hf_energy / hf_thresh, 3.0) * 0.35
    score += min(grad_mag / grad_thresh, 3.0) * 0.30
    score += (local_std / std_thresh) * 0.20
    score += min(asymmetry / asym_thresh, 2.0) * 0.15
    score = min(score / 3.0, 1.0)  # normalize to [0,1]

    is_adversarial = score > 0.42
    # Map score to confidence range 82-99.9%
    confidence = 82.0 + score * 17.9
    confidence = round(min(confidence, 99.9), 2)

    # Guess attack type based on frequency signature
    attack_type = "None"
    if is_adversarial:
        if hf_energy > hf_thresh * 2:
            attack_type = "FGSM"
        elif grad_mag > grad_thresh * 2.5:
            attack_type = "PGD"
        elif asymmetry > asym_thresh * 1.5:
            attack_type = "DeepFool"
        else:
            attack_type = "CW (Carlini & Wagner)"

    return {
        "is_adversarial": is_adversarial,
        "confidence": confidence,
        "score": round(score, 4),
        "attack_type": attack_type,
        "risk": "Critical" if score > 0.7 else ("High" if is_adversarial else "Low"),
        "metrics": {
            "hf_energy": round(hf_energy, 6),
            "grad_magnitude": round(grad_mag, 6),
            "local_std": round(local_std, 6),
            "channel_asymmetry": round(asymmetry, 6),
        },
        "suspicious_regions": int(score * 28) if is_adversarial else 0,
    }


# ---------------------------------------------------------------------------
# Attack generators (FGSM-style, PGD-style, DeepFool-style)
# ---------------------------------------------------------------------------
def _fgsm_attack(arr: np.ndarray, epsilon: float = 0.03) -> np.ndarray:
    """Simulate FGSM by adding sign-like structured noise."""
    noise = np.sign(np.random.randn(*arr.shape).astype(np.float32))
    # Smooth to mimic gradient structure
    from scipy.ndimage import gaussian_filter
    noise = gaussian_filter(noise, sigma=0.5)
    return np.clip(arr + epsilon * np.sign(noise), 0, 1)


def _pgd_attack(arr: np.ndarray, epsilon: float = 0.03, steps: int = 10) -> np.ndarray:
    """Simulate PGD: iterative small perturbations."""
    step_size = epsilon / steps
    perturbed = arr.copy()
    for _ in range(steps):
        delta = step_size * np.sign(np.random.randn(*arr.shape).astype(np.float32))
        perturbed = perturbed + delta
        perturbed = np.clip(perturbed, arr - epsilon, arr + epsilon)
        perturbed = np.clip(perturbed, 0, 1)
    return perturbed


def _deepfool_attack(arr: np.ndarray, epsilon: float = 0.02) -> np.ndarray:
    """Simulate DeepFool: smooth low-amplitude perturbation."""
    from scipy.ndimage import gaussian_filter
    noise = gaussian_filter(np.random.randn(*arr.shape).astype(np.float32), sigma=2.0)
    noise = noise / (np.max(np.abs(noise)) + 1e-8)
    return np.clip(arr + epsilon * noise, 0, 1)


def _cw_attack(arr: np.ndarray, epsilon: float = 0.01) -> np.ndarray:
    """Simulate C&W: very subtle high-frequency perturbation."""
    from scipy.ndimage import laplace
    noise = np.stack([laplace(arr[:, :, c]) for c in range(3)], axis=2).astype(np.float32)
    noise = noise / (np.max(np.abs(noise)) + 1e-8)
    return np.clip(arr + epsilon * noise, 0, 1)


ATTACK_FNS = {
    "FGSM": _fgsm_attack,
    "PGD": _pgd_attack,
    "DeepFool": _deepfool_attack,
    "CW": _cw_attack,
}

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    return {"message": "Advershield AI API", "status": "operational", "version": "2.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat(), "service": "advershield-ai"}


@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    """Analyze an uploaded image for adversarial perturbations."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files are supported.")

    data = await file.read()
    if len(data) == 0:
        raise HTTPException(400, "Empty file.")
    if len(data) > 20 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 20 MB).")

    try:
        arr = _load_image(data)
    except Exception as e:
        raise HTTPException(400, f"Could not decode image: {e}")

    result = _detect_adversarial(arr)

    # Update analytics
    analytics_store["total_analyzed"] += 1
    if result["is_adversarial"]:
        analytics_store["attacks_detected"] += 1
        analytics_store["attack_distribution"][result["attack_type"].split()[0]] = \
            analytics_store["attack_distribution"].get(result["attack_type"].split()[0], 0) + 1
    else:
        analytics_store["clean_images"] += 1

    event = {
        "id": f"scan-{analytics_store['total_analyzed']:06d}",
        "timestamp": datetime.utcnow().isoformat(),
        "filename": file.filename,
        "is_adversarial": result["is_adversarial"],
        "attack_type": result["attack_type"],
        "confidence": result["confidence"],
        "risk": result["risk"],
    }
    analytics_store["history"].insert(0, event)
    analytics_store["history"] = analytics_store["history"][:50]

    return JSONResponse({
        "status": "success",
        "scan_id": event["id"],
        "filename": file.filename,
        "timestamp": event["timestamp"],
        **result,
    })


@app.post("/api/simulate")
async def simulate(
    file: UploadFile = File(...),
    attack_type: str = Form("FGSM"),
    epsilon: float = Form(0.03),
):
    """Generate an adversarial example from a clean image."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files are supported.")

    attack_type = attack_type.upper()
    if attack_type not in ATTACK_FNS:
        raise HTTPException(400, f"Unknown attack. Supported: {list(ATTACK_FNS.keys())}")

    epsilon = max(0.001, min(float(epsilon), 0.3))

    data = await file.read()
    try:
        arr = _load_image(data)
    except Exception as e:
        raise HTTPException(400, f"Could not decode image: {e}")

    t0 = time.time()
    adversarial = ATTACK_FNS[attack_type](arr, epsilon=epsilon)
    elapsed = round(time.time() - t0, 3)

    perturbation = np.abs(adversarial - arr)
    l_inf = float(np.max(perturbation))
    l2 = float(np.linalg.norm(perturbation))
    psnr = float(10 * math.log10(1.0 / (np.mean((arr - adversarial) ** 2) + 1e-10)))

    analytics_store["simulations_run"] += 1

    return JSONResponse({
        "status": "success",
        "attack_type": attack_type,
        "epsilon": epsilon,
        "original_b64": _array_to_b64(arr),
        "adversarial_b64": _array_to_b64(adversarial),
        "perturbation_b64": _array_to_b64(perturbation * 10),  # amplified for visibility
        "metrics": {
            "l_inf_norm": round(l_inf, 6),
            "l2_norm": round(l2, 4),
            "psnr_db": round(psnr, 2),
            "generation_time_s": elapsed,
        },
    })


@app.get("/api/analytics/dashboard")
async def dashboard():
    """Return all dashboard analytics."""
    total = analytics_store["total_analyzed"]
    attacked = analytics_store["attacks_detected"]
    accuracy = round(100 - (attacked / max(total, 1)) * 100 * 0.0043, 2)  # simulated accuracy

    dist_total = sum(analytics_store["attack_distribution"].values())
    dist_pct = [
        {"name": k, "value": round(v / max(dist_total, 1) * 100, 1), "count": v}
        for k, v in analytics_store["attack_distribution"].items()
    ]

    return JSONResponse({
        "status": "success",
        "stats": {
            "total_analyzed": total,
            "attacks_detected": attacked,
            "clean_images": analytics_store["clean_images"],
            "simulations_run": analytics_store["simulations_run"],
            "system_accuracy": accuracy,
            "detection_rate": round(attacked / max(total, 1) * 100, 2),
        },
        "attack_distribution": dist_pct,
        "daily_volume": analytics_store["daily_volume"],
        "recent_scans": analytics_store["history"][:10],
        "performance": [
            {"time": f"{h:02d}:00", "cpu": random.randint(30, 75), "gpu": random.randint(55, 95)}
            for h in range(6, 18)
        ],
    })


@app.get("/api/analytics/history")
async def history(limit: int = 20):
    return JSONResponse({
        "status": "success",
        "history": analytics_store["history"][:limit],
        "total": len(analytics_store["history"]),
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
