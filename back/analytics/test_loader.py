

from dataset_loader import load_dataset

df = load_dataset()

print("\nDATASET PREVIEW\n")
print(df.head())

print("\nDATASET INFO\n")
print(df.info())