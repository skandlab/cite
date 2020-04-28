import pandas as pd
import json

INPUT_FILE = "source/pancancer_product_score.csv"
OUTPUT_METADATA_FILE = "output/metadata.json"
OUTPUT_DATA_FILE = "output/data.json"

INTERACTION_TYPE_DESCRIPTION = {
    "cc": "cancer-cancer",
    "cs": "cancer-stroma",
    "nn": "normal-normal",
    "sc": "stroma-cancer",
    "ss": "stroma-stroma",
}

df = pd.read_csv(INPUT_FILE, usecols=["lr", "t", "cc", "cs", "nn", "sc", "ss"])

df[["ligand", "receptor"]] = df.lr.str.split("_", expand=True)
df.drop("lr", axis=1, inplace=True)
df.columns = ["tumorType", "cc", "cs", "nn", "sc", "ss", "ligand", "receptor"]

list_tumor_type, list_ligand, list_receptor, list_interaction_type = (
    df.tumorType.unique().tolist(),
    df.ligand.unique().tolist(),
    df.receptor.unique().tolist(),
    ["cc", "cs", "nn", "sc", "ss"],
)
list_tumor_type = [tumorType for tumorType in list_tumor_type if tumorType != "MEDIAN"]

with open(OUTPUT_METADATA_FILE, "w") as f:
    json.dump(
        {
            "ligand": list_ligand,
            "receptor": list_receptor,
            "tumorType": list_tumor_type,
            "interactionType": list_interaction_type,
            "metadata": {
                "tumorTypeOptions": [
                    {"isChecked": False, "value": tumor_type}
                    for tumor_type in list_tumor_type
                ],
                "interactionTypeOptions": [
                    {
                        "isChecked": False,
                        "value": interaction_type,
                        "description": INTERACTION_TYPE_DESCRIPTION[interaction_type],
                    }
                    for interaction_type in list_interaction_type
                ],
            },
        },
        f,
    )


df.set_index("tumorType", inplace=True)
df = df.loc[list_tumor_type].reset_index()
ligand_receptor_groups = df.groupby(["ligand", "receptor"]).groups
cols = ["tumorType"]
cols.extend(list_interaction_type)

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
