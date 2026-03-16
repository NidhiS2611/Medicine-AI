from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import gdown
import sys

app = Flask(__name__)
CORS(app)

# Google Drive se model download
FILE_ID = "1wV5ifFRdzP5VFKO0730u2wWG1yhLWkQi"
MODEL_URL = f"https://drive.google.com/uc?id={FILE_ID}"
MODEL_PATH = "demand_model.pkl"

def download_model():
    """Model download karo agar nahi hai to"""
    if not os.path.exists(MODEL_PATH):
        print("📥 Downloading model from Google Drive...")
        try:
            gdown.download(MODEL_URL, MODEL_PATH, quiet=False)
            if os.path.exists(MODEL_PATH):
                file_size = os.path.getsize(MODEL_PATH) / (1024 * 1024)  # MB mein
                print(f"✅ Download complete! Size: {file_size:.2f} MB")
            else:
                print("❌ Download failed: File not found")
                sys.exit(1)
        except Exception as e:
            print(f"❌ Download error: {str(e)}")
            sys.exit(1)
    else:
        file_size = os.path.getsize(MODEL_PATH) / (1024 * 1024)
        print(f"✅ Model already exists. Size: {file_size:.2f} MB")

# Download and load model
download_model()
print("🔄 Loading model...")
try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {str(e)}")
    sys.exit(1)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        
        # Input validation
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

        sample = pd.DataFrame({
            "medicine": [medicine],
            "month": [month],
            "year": [year],
            "stock_level": [stock],
            "expiry_days_remaining": [expiry_days],
            "unit_price": [price]
        })

        prediction = model.predict(sample)[0]
        predicted_sales = int(prediction)

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

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": True
    })

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Medicine Demand Prediction API",
        "endpoints": {
            "/predict": "POST - Make prediction",
            "/health": "GET - Health check"
        }
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)