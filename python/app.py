from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import gdown
import threading

app = Flask(__name__)

# CORS (frontend allow)
CORS(app, resources={
    r"/*": {
        "origins": "https://medicine-ai-six.vercel.app"
    }
})

# Google Drive model details
FILE_ID = "1wV5ifFRdzP5VFKO0730u2wWG1yhLWkQi"
MODEL_URL = f"https://drive.google.com/uc?id={FILE_ID}"
MODEL_PATH = "demand_model.pkl"

# Global model variable
model = None

# 🔒 ADD LOCK (IMPORTANT)
model_lock = threading.Lock()


# 🔥 Load model (lazy + thread-safe)
def get_model():
    global model

    if model is None:
        with model_lock:   # 🔒 prevent multiple downloads
            if model is None:
                print("📥 Loading model...")

                # Download only if not present
                if not os.path.exists(MODEL_PATH):
                    print("📥 Downloading model from Google Drive...")
                    gdown.download(MODEL_URL, MODEL_PATH, quiet=False, fuzzy=True)

                # Load model
                model = joblib.load(MODEL_PATH)
                print("✅ Model loaded!")

    return model


# 🔮 Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Validate input
        required_fields = ["medicine", "month", "year", "stock", "expiry", "price"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        medicine = data["medicine"]
        month = int(data["month"])
        year = int(data["year"])
        stock = int(data["stock"])
        expiry_days = int(data["expiry"])
        price = int(data["price"])

        # Create dataframe
        sample = pd.DataFrame({
            "medicine": [medicine],
            "month": [month],
            "year": [year],
            "stock_level": [stock],
            "expiry_days_remaining": [expiry_days],
            "unit_price": [price]
        })

        # Get model
        m = get_model()

        # Predict
        prediction = m.predict(sample)[0]
        predicted_sales = int(prediction)

        # Business logic
        if predicted_sales >= stock:
            risk = "SAFE"
        else:
            risk = "EXPIRY RISK"

        remaining_stock = max(0, stock - predicted_sales)
        loss = remaining_stock * price

        return jsonify({
            "medicineName": medicine,
            "month": month,
            "year": year,
            "stock": stock,
            "expiryDays": expiry_days,
            "unitPrice": price,
            "predictedSales": predicted_sales,
            "remainingStock": remaining_stock,
            "riskLevel": risk,
            "lossEstimate": loss
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ❤️ Health check
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None
    })


# 🏠 Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Medicine Demand Prediction API",
        "endpoints": {
            "/predict": "POST - Make prediction",
            "/health": "GET - Health check"
        }
    })


# Run app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)