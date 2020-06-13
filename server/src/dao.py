import pandas as pd
import pickle
import json
from . import settings

mapLigandIndex = pd.read_parquet(settings.DATA_MAP_LIGAND_INDEX_FILEPATH)
mapReceptorIndex = pd.read_parquet(settings.DATA_MAP_RECEPTOR_INDEX_FILEPATH)
mapTumorIndex = pd.read_parquet(settings.DATA_MAP_TUMOR_INDEX_FILEPATH)
dfScores = pd.read_parquet(settings.DATA_SCORES_FILEPATH)

with open(settings.DATA_DEFAULT_SCORES_FILEPATH, "r") as f:
    defaultScores = json.load(f)

with open(settings.DATA_METADATA_FILEPATH, "r") as f:
    metadata = json.load(f)
    (ligandList, receptorList, tumorList, interactionList) = (
        metadata["ligands"],
        metadata["receptors"],
        metadata["tumors"],
        metadata["interactions"],
    )

with open(settings.DATA_FILTERS_FILEPATH, "r") as f:
    dataFilters = json.load(f)

with open(settings.DATA_DECONV_VALUES_FILEPATH, "rb") as f:
    deconvValues = pickle.load(f)
