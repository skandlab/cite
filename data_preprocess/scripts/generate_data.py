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

TUMOR_ABBR = {
    "BLCA": "Bladder Urothelial Carcinoma",
    "BRCA": "Breast invasive carcinoma",
    "CESC": "Cervical squamous cell carcinoma and endocervical adenocarcinoma",
    "CRC": "Colorectal carcinoma",
    "ESCA": "Esophageal carcinoma",
    "GBM": "Glioblastoma multiforme",
    "HNSC": "Head and Neck squamous cell carcinoma",
    "KIRC": "Kidney renal clear cell carcinoma",
    "KIRP": "Kidney renal papillary cell carcinoma",
    "LGG": "Brain Lower Grade Glioma",
    "LIHC": "Liver hepatocellular carcinoma",
    "LUAD": "Lung adenocarcinoma",
    "LUSC": "Lung squamous cell carcinoma",
    "OV": "Ovarian serous cystadenocarcinoma",
    "PAAD": "Pancreatic adenocarcinoma",
    "PRAD": "Pancreatic adenocarcinoma",
    "SKCM": "Skin Cutaneous Melanoma",
    "STAD": "Stomach adenocarcinoma",
    "THCA": "Thyroid carcinoma",
    "UCEC": "Uterine Corpus Endometrial Carcinoma",
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

list_ligand.sort()
list_receptor.sort()
list_receptor.sort()
list_interaction_type.sort()

with open(OUTPUT_METADATA_FILE, "w") as f:
    json.dump(
        {
            "ligand": list_ligand,
            "receptor": list_receptor,
            "tumorType": list_tumor_type,
            "interactionType": list_interaction_type,
            "metadata": {
                "ligandOptions": [
                    {"index": index, "mute": False, "isChecked": False, "value": ligand}
                    for index, ligand in enumerate(list_ligand)
                ],
                "receptorOptions": [
                    {
                        "index": index,
                        "mute": False,
                        "isChecked": False,
                        "value": receptor,
                    }
                    for index, receptor in enumerate(list_receptor)
                ],
                "tumorOptions": [
                    {
                        "index": index,
                        "mute": False,
                        "isChecked": False,
                        "value": tumor_type,
                        "description": TUMOR_ABBR[tumor_type],
                    }
                    for index, tumor_type in enumerate(list_tumor_type)
                ],
                "interactionOptions": [
                    {
                        "index": index,
                        "mute": False,
                        "isChecked": False,
                        "value": interaction_type,
                        "description": INTERACTION_TYPE_DESCRIPTION[interaction_type],
                    }
                    for index, interaction_type in enumerate(list_interaction_type)
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
