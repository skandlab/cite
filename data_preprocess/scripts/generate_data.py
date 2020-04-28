import pandas as pd
import json

INPUT_FILE = "source/pancancer_product_score.csv"
OUTPUT_METADATA_FILE = "output/metadata.json"
OUTPUT_DATA_FILE = "output/data.json"

df = pd.read_csv(INPUT_FILE, usecols=["lr", "t", "cc", "cs", "nn", "sc", "ss"])

df[["ligand", "receptor"]] = df.lr.str.split("_", expand=True)
df.drop("lr", axis=1, inplace=True)
df.columns = ["tumorType", "cc", "cs", "nn", "sc", "ss", "ligand", "receptor"]

list_tumor, list_ligand, list_receptor, list_interactions = (
    df.tumorType.unique().tolist(),
    df.ligand.unique().tolist(),
    df.receptor.unique().tolist(),
    ["cc", "cs", "nn", "sc", "ss"],
)
list_tumor = [tumor for tumor in list_tumor if tumor != "MEDIAN"]

with open(OUTPUT_METADATA_FILE, "w") as f:
    json.dump(
        {
            "ligand": list_ligand,
            "receptor": list_receptor,
            "tumorType": list_tumor,
            "interactionType": list_interactions,
        },
        f,
    )


df.set_index("tumorType", inplace=True)
df = df.loc[list_tumor].reset_index()
ligand_receptor_groups = df.groupby(["ligand", "receptor"]).groups
cols = ["tumorType"]
cols.extend(list_interactions)

with open(OUTPUT_DATA_FILE, "w") as f:
    json.dump(
        [
            {
                "ligand": ligand,
                "receptor": receptor,
                "scoreMatrix": df.loc[indexes, cols].to_dict(orient="records"),
            }
            for [ligand, receptor], indexes in ligand_receptor_groups.items()
        ],
        f,
    )
