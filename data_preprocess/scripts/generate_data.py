import pandas as pd

INPUT_FILE = "source/pancancer_product_score.csv"
OUTPUT_FILE = "output/data.csv"

df = pd.read_csv(INPUT_FILE, usecols=["lr", "t", "cc", "cs", "nn", "sc", "ss"])

df[["ligand", "receptor"]] =  df.lr.str.split("_", expand=True)
df.drop("lr", axis=1, inplace=True)

df.columns = ["cancer_type", "cc", "cs", "nn", "sc", "ss", "ligand", "receptor"]

df.to_csv(OUTPUT_FILE, index=False)