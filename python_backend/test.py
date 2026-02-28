import pickle
import re
from pathlib import Path

# Load model and vectorizer
base_path = Path(__file__).resolve().parent

with open(base_path / "best_model.pkl", "rb") as f:
    model = pickle.load(f)

with open(base_path / "vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)


# Same cleaning function (VERY IMPORTANT)
def clean_text(text):
    text = text.lower()
    text = re.sub(r'\W+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# Prediction function
def predict_message(message):
    cleaned = clean_text(message)
    vect = vectorizer.transform([cleaned])
    prediction = model.predict(vect)[0]
    return "Spam" if prediction == 1 else "Ham"


# Test examples
print(predict_message("Congratulations! You won a free ticket"))
print(predict_message("Hey, are we meeting tomorrow?"))