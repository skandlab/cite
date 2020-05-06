import pandas as pd
import pickle
import json
from . import settings

deconv_exp_df = pd.read_parquet(settings.DATA_DECONV_EXP_FILEPATH)
samples_exp_df = pd.read_parquet(settings.DATA_SAMPLES_EXP_FILEPATH)

with open(settings.DATA_MAPPING_TUMOR_SAMPLES, "rb") as f:
    mapping_tumor_samples = pickle.load(f)

with open(settings.DATA_SCORES_FILEPATH, "r") as f:
    data_score = json.load(f)

with open(settings.DATA_METADATA_FILEPATH, "r") as f:
    __tmp__ = json.load(f)
    (
        list_ligand,
        list_receptor,
        list_tumor_type,
        list_interaction_type,
        checkboxOptions,
    ) = (
        __tmp__["ligand"],
        __tmp__["receptor"],
        __tmp__["tumorType"],
        __tmp__["interactionType"],
        __tmp__["metadata"],
    )
