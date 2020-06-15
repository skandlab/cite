import pandas as pd
import pickle
import json
from . import settings

DB_INSTANCE = None


def init():
    global DB_INSTANCE
    if DB_INSTANCE is None:
        DB_INSTANCE = DAO()
    else:
        raise Exception("Singleton instance already instantiated.")


class DAO:
    def __init__(self):
        self.mapLigandIndex = pd.read_parquet(settings.DATA_MAP_LIGAND_INDEX_FILEPATH)
        self.mapReceptorIndex = pd.read_parquet(
            settings.DATA_MAP_RECEPTOR_INDEX_FILEPATH
        )
        self.mapTumorIndex = pd.read_parquet(settings.DATA_MAP_TUMOR_INDEX_FILEPATH)
        self.dfScores = pd.read_parquet(settings.DATA_SCORES_FILEPATH)

        with open(settings.DATA_DEFAULT_SCORES_FILEPATH, "r") as f:
            self.defaultScores = json.load(f)

        with open(settings.DATA_METADATA_FILEPATH, "r") as f:
            metadata = json.load(f)
            (
                self.ligandList,
                self.receptorList,
                self.tumorList,
                self.interactionList,
            ) = (
                metadata["ligands"],
                metadata["receptors"],
                metadata["tumors"],
                metadata["interactions"],
            )
            self.ligandDic = {ligand: True for ligand in self.ligandList}
            self.receptorDic = {receptor: True for receptor in self.receptorList}
            self.ligandAllDic = {ligand: False for ligand in self.ligandList}
            self.receptorAllDic = {receptor: False for receptor in self.receptorList}
            self.interactionAllDic = {ligand: False for ligand in self.interactionList}
            self.tumorAllDic = {receptor: False for receptor in self.tumorList}

        with open(settings.DATA_FILTERS_FILEPATH, "r") as f:
            self.dataFilters = json.load(f)

        with open(settings.DATA_DECONV_VALUES_FILEPATH, "rb") as f:
            self.deconvValues = pickle.load(f)
