INTERACTION_TYPE_DESCRIPTION = {
    "cc": "cancer-cancer",
    "cs": "cancer-stroma",
    "nn": "normal-normal",
    "sc": "stroma-cancer",
    "ss": "stroma-stroma",
}

TUMOR_TYPE_DESCRIPTION = {
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

EXP_PER_CELLTYPE_FILE = "source/expPerCellType.csv"
PAIRS_FILE = "source/pairs_v4.txt"
INPUT_SCORE_FILE = "source/productScore_v4.csv"

MAPPING_TUMOR_SAMPLES_FILE = "source/mapTumorSamples.json"
EXP_PER_SAMPLES_FILE = "source/expPerSamples.parquet"
PURITY_FILE = "source/purity.parquet"

DECONV_VALUES_FILE = "output/deconvValues.json"
FILTERS_FILE = "output/filters.json"
LIGAND_INDEX_FILE = "output/map_ligand_index.parquet"
RECEPTOR_INDEX_FILE = "output/map_receptor_index.parquet"
TUMOR_INDEX_FILE = "output/map_tumor_index.parquet"
METADATA_FILE = "output/metadata.json"
SCORES_FILE = "output/scores.parquet"
