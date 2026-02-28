import pandas as pd
import re
from pathlib import Path
import pickle as pkl
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.linear_model import LogisticRegression

def clean_text(text):
    text = text.lower()                  # lowercase
    text = re.sub(r'^(subject|re|fwd)\s*:\s*', '', text) # remove 'subject:' at the beginning
    text = re.sub(r'^re\s*:\s*', '', text)   # remove 're:' if present
    text = re.sub(r'\r\n|\n', ' ', text)     # remove \r\n and new lines
    text = re.sub(r'\W+', ' ', text)     # remove special characters
    text = re.sub(r'\s+', ' ', text)     # remove extra spaces
    return text.strip()


file_path1 = Path(__file__).resolve().parent / "SMS_spam_ham.csv"
file_path2 = Path(__file__).resolve().parent / "Mail_spam_ham.csv"
file_path3 = Path(__file__).resolve().parent / "Bank_spam_ham.csv"
df1 = pd.read_csv(file_path1, encoding="latin-1")
df2 = pd.read_csv(file_path2, encoding="latin-1")
df3 = pd.read_csv(file_path3, encoding="latin-1")

print(df1.shape)
print(df1.info())
print(df1.head())
print(df2.shape)
print(df2.info())
print(df2.head())

# Data preprocessing 1st dataset

# Drop unnecessary columns
df1.drop(columns=["Unnamed: 2", "Unnamed: 3", "Unnamed: 4"], inplace=True)

# Check for missing values
print(df1.isnull().sum())

# Rename columns
df1.rename(columns={"v1": "label", "v2": "text"}, inplace=True)

# Map labels to binary values   
df1["label"] = df1["label"].map({"ham": 0, "spam": 1})

df1['text'] = df1['text'].apply(clean_text)
df1 = df1[['text', 'label']]

# Data preprocessing 2nd dataset
df2.drop(columns=["Unnamed: 0", "label"], inplace=True)

# Check for missing values
print(df2.isnull().sum())

# Rename columns
df2.rename(columns={"label_num": "label"}, inplace=True)

df2['text'] = df2['text'].apply(clean_text)
df2.columns = ['text', 'label']

#Data preprocessing 3rd dataset
print(df3.isnull().sum())
df3["label"] = df3["label"].map({"ham": 0, "spam": 1})
df3['text'] = df3['text'].apply(clean_text)
print(df3.info())

#concatenate the two datasets
df = pd.concat([df1, df2, df3], ignore_index=True)
df = df.copy()

print(df['label'].value_counts())
print(df.shape)


# Feature extraction using TF-IDF
vectorizer = TfidfVectorizer(max_features=5000,ngram_range=(1,2),min_df=5)
X = vectorizer.fit_transform(df['text'])
y = df['label']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

#logistic regression
lr_model = LogisticRegression(max_iter=2000, class_weight='balanced',C=2)
lr_model.fit(X_train, y_train)

lr_pred = lr_model.predict(X_test)
lr_accuracy = accuracy_score(y_test, lr_pred)

# Train a Multinomial Naive Bayes classifier
nb_model = MultinomialNB()
nb_model.fit(X_train, y_train)

# Predict on the test set
nb_pred = nb_model.predict(X_test)
nb_accuracy = accuracy_score(y_test, nb_pred)

if nb_accuracy > lr_accuracy:
    best_model = nb_model
    best_name = "Naive Bayes"
    best_pred = nb_pred
else:
    best_model = lr_model
    best_name = "Logistic Regression"
    best_pred = lr_pred

print(f"\nBest Model: {best_name}")
print("Best Accuracy:", max(nb_accuracy, lr_accuracy))
print("\nClassification Report:\n", classification_report(y_test, best_pred))
print("\nConfusion Matrix:\n", confusion_matrix(y_test, best_pred))


# Save the best model and vectorizer
model_path = Path(__file__).resolve().parent / "best_model.pkl" 
vectorizer_path = Path(__file__).resolve().parent / "vectorizer.pkl"
with open(model_path, "wb") as model_file:
    pkl.dump(best_model, model_file)

with open(vectorizer_path, "wb") as vectorizer_file:
    pkl.dump(vectorizer, vectorizer_file)

print("\nModel and vectorizer saved successfully!")
