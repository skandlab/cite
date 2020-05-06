import pandas as pd
import numpy as np
import pickle
import json
import shutil
import itertools


INPUT_METADATA_FILE = "output/metadata.json"
INPUT_MAPPING_TUMOR_SAMPLES = "/home/centos/ssd/cigrx_n/db/data/output/cohorts/tcga/common/mapping_tumor_samples.pickle"
INPUT_RAW_EXPRESSION = "source/coding_expr_mut.pkl"
INPUT_PURITY = "/home/centos/ssd/cigrx_n/db/data/output/cohorts/tcga/common/purity.parquet"

OUTPUT_EXPRESSION = "output/samples_exp.parquet"
OUTPUT_MAPPING_TUMOR_SAMPLES = "output/mapping_tumor_samples.pickle"


with open(INPUT_METADATA_FILE, "r") as f:
    metadata = json.load(f)
list_ligand = metadata["ligand"]
list_receptor = metadata["receptor"]

with open(INPUT_MAPPING_TUMOR_SAMPLES, "rb") as f:
    mapping_tumor_samples = pickle.load(f)

df = pd.read_pickle(INPUT_RAW_EXPRESSION)
df = df.loc[list(itertools.chain.from_iterable(mapping_tumor_samples.values())), np.union1d(list_ligand, list_receptor)]
df["cancer"] = pd.read_parquet(INPUT_PURITY).loc[df.index, "cancer"]

df.astype("float").round(3).to_parquet(OUTPUT_EXPRESSION)

shutil.copyfile(INPUT_MAPPING_TUMOR_SAMPLES, OUTPUT_MAPPING_TUMOR_SAMPLES)