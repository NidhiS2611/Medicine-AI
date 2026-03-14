from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

model = joblib.load("demand_model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    medicine = data["medicine"]
    month = int(data["month"])
    year = int(data["year"])
    stock = int(data["stock"])
    expiry_days = int(data["expiry"])
    price = int(data["price"])

    

    sample = pd.DataFrame({
        "medicine":[medicine],
        "month":[month],
        "year":[year],
        "stock_level":[stock],
        "expiry_days_remaining":[expiry_days],
        "unit_price":[price]
    })

    prediction = model.predict(sample)[0]
    predicted_sales = int(prediction)

    if predicted_sales >= stock:
        risk = "SAFE"
    else:
        risk = "EXPIRY RISK"

    remaining_stock = stock - predicted_sales

    if remaining_stock < 0:
        remaining_stock = 0

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

if __name__ == "__main__":
    app.run(debug=True)