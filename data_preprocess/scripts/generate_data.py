import pandas as pd
import json

INPUT_EXP_FILE = "source/deconv_logx+1nt_pct1.csv"
INPUT_SCORE_FILE = "source/product_score.csv"

OUTPUT_METADATA_FILE = "output/metadata.json"
OUTPUT_EXP_FILE = "output/deconv_exp.parquet"
OUTPUT_DATA_FILE = "output/scores.json"

INTERACTION_TYPE_DESCRIPTION = {
    "cc": "cancer-cancer",
    "cs": "cancer-stroma",
    "nn": "normal-normal",
    "sc": "stroma-cancer",
    "ss": "stroma-stroma",
}

df = pd.read_csv(
    INPUT_SCORE_FILE,
    usecols=["ligand", "receptor", "tumorType", "cc", "cs", "nn", "sc", "ss"],
)

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
                "ligandOptions": [
                    {"isChecked": False, "value": ligand} for ligand in list_ligand
                ],
                "receptorOptions": [
                    {"isChecked": False, "value": receptor}
                    for receptor in list_receptor
                ],
                "tumorOptions": [
                    {"isChecked": False, "value": tumor_type}
                    for tumor_type in list_tumor_type
                ],
                "interactionOptions": [
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
                "scoreMatrix": df.loc[indexes, cols].round(3).to_dict(orient="records"),
            }
            for [ligand, receptor], indexes in ligand_receptor_groups.items()
        ],
        f,
    )


exp_df = pd.read_csv(INPUT_EXP_FILE, usecols=["sample", "t", "C", "N", "S", "T"])
exp_df.columns = [
    "gene",
    "tumorType",
    "Cancer",
    "Normal (Median)",
    "Stroma",
    "TumorBulk (Median)",
]
exp_df = exp_df[
    ["gene", "tumorType", "Cancer", "Stroma", "TumorBulk (Median)", "Normal (Median)"]
]
exp_df.set_index(["gene", "tumorType"], inplace=True)
exp_df.round(3).to_parquet(OUTPUT_EXP_FILE)
