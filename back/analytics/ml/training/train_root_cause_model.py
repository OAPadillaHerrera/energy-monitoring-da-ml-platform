

import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from analytics.data.processing.build_ml_dataset import build_ml_dataset
import joblib

def train_root_cause_model():

    df = build_ml_dataset()

    print("\n=== DATASET LOADED ===")
    print(df.head())

    feature_columns = [
        "consumption_kwh",
        "voltage_120v",
        "voltage_240v",
        "hour",
        "weekday",
        "rolling_mean_24h",
        "delta_consumption",
        "voltage_diff",
    ]

    y = df["root_cause"]

    print("\n=== ORIGINAL TARGET DISTRIBUTION ===")
    print(y.value_counts())

    min_samples = 5

    class_counts = df["root_cause"].value_counts()
    valid_classes = class_counts[class_counts >= min_samples].index

    df = df[df["root_cause"].isin(valid_classes)]

    print("\n=== FILTERED TARGET DISTRIBUTION ===")
    print(df["root_cause"].value_counts())

    X = df[feature_columns]
    y = df["root_cause"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("\nTrain size:", len(X_train))
    print("Test size:", len(X_test))

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)

    y_proba = model.predict_proba(X_test)

    classes = model.classes_

    print("\n=== NON-NORMAL PREDICTIONS ANALYSIS ===")

    count = 0

    for i in range(len(y_pred)):

        if y_test.iloc[i] != "normal":

            probs = dict(zip(classes, y_proba[i]))

            print(f"\nSample {i}:")
            print("Actual:", y_test.iloc[i])
            print("Predicted:", y_pred[i])
            print("Probabilities:", probs)

            count += 1

        if count == 10:
            break

    print("\n=== MODEL PERFORMANCE ===")

    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {accuracy:.4f}")

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    return model

if __name__ == "__main__":
    model = train_root_cause_model()
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/root_cause_model.pkl")
    print("\nModel saved as root_cause_model.pkl")