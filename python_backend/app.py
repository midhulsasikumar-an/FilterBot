from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS
import re
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)
# Load model and vectorizer
base_path = Path(__file__).resolve().parent

model_path = base_path / "best_model.pkl"
vectorizer_path = base_path / "vectorizer.pkl"

if not model_path.exists():
    raise FileNotFoundError(
        f"Missing {model_path.name} in {base_path}. Run model.py to train and save the model."
    )

if not vectorizer_path.exists():
    raise FileNotFoundError(
        f"Missing {vectorizer_path.name} in {base_path}. Run model.py to train and save the vectorizer."
    )

with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(vectorizer_path, "rb") as f:
    vectorizer = pickle.load(f)


def clean_text(text):
    text = text.lower()
    text = re.sub(r'\W+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "message is required"}), 400

    data = message
    cleaned = clean_text(data)
    vect = vectorizer.transform([cleaned])
    prediction = model.predict(vect)[0]
    confidence = None
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(vect)[0]
        confidence = round(float(probabilities[int(prediction)] * 100), 2)

    result = "Spam" if prediction == 1 else "Ham"

    return jsonify({"prediction": result, "confidence": confidence})


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(debug=debug_mode, use_reloader=False)
