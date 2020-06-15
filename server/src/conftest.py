import pandas as pd
from . import dao


class Mock:
    def __init__(self):
        tmpList = []
        index = 0
        for ligand in ["A", "B", "C"]:
            for receptor in ["D", "E"]:
                for tumor in ["CRC", "LUAD"]:
                    tmpList.append(
                        {
                            "ligand": ligand,
                            "receptor": receptor,
                            "tumorType": tumor,
                            "cc": index,
                            "nn": index + 1,
                        }
                    )
                    index += 2
        scores = pd.DataFrame(tmpList)
        self.defaultScores = {
            "scores": [
                {
                    "ligand": "C",
                    "receptor": "E",
                    "data": {
                        "xyValues": [
                            {"tumorType": "CRC", "cc": 20, "nn": 21},
                            {"tumorType": "LUAD", "cc": 22, "nn": 23},
                        ],
                        "keys": ["cc", "nn"],
                        "indexBy": "tumorType",
                    },
                },
                {
                    "ligand": "C",
                    "receptor": "D",
                    "data": {
                        "xyValues": [
                            {"tumorType": "CRC", "cc": 16, "nn": 17},
                            {"tumorType": "LUAD", "cc": 18, "nn": 19},
                        ],
                        "keys": ["cc", "nn"],
                        "indexBy": "tumorType",
                    },
                },
                {
                    "ligand": "B",
                    "receptor": "E",
                    "data": {
                        "xyValues": [
                            {"tumorType": "CRC", "cc": 12, "nn": 13},
                            {"tumorType": "LUAD", "cc": 14, "nn": 15},
                        ],
                        "keys": ["cc", "nn"],
                        "indexBy": "tumorType",
                    },
                },
                {
                    "ligand": "B",
                    "receptor": "D",
                    "data": {
                        "xyValues": [
                            {"tumorType": "CRC", "cc": 8, "nn": 9},
                            {"tumorType": "LUAD", "cc": 10, "nn": 11},
                        ],
                        "keys": ["cc", "nn"],
                        "indexBy": "tumorType",
                    },
                },
                {
                    "ligand": "A",
                    "receptor": "E",
                    "data": {
                        "xyValues": [
                            {"tumorType": "CRC", "cc": 4, "nn": 5},
                            {"tumorType": "LUAD", "cc": 6, "nn": 7},
                        ],
                        "keys": ["cc", "nn"],
                        "indexBy": "tumorType",
                    },
                },
                {
                    "ligand": "A",
                    "receptor": "D",
                    "data": {
                        "xyValues": [
                            {"tumorType": "CRC", "cc": 0, "nn": 1},
                            {"tumorType": "LUAD", "cc": 2, "nn": 3},
                        ],
                        "keys": ["cc", "nn"],
                        "indexBy": "tumorType",
                    },
                },
            ],
            "itemIsPresent": [
                {
                    "filterType": "ligand",
                    "itemIsPresent": {"A": False, "B": False, "C": False},
                },
                {"filterType": "receptor", "itemIsPresent": {"D": False, "E": False},},
                {
                    "filterType": "interaction",
                    "itemIsPresent": {"cc": False, "nn": False},
                },
                {
                    "filterType": "tumor",
                    "itemIsPresent": {"CRC": False, "LUAD": False},
                },
            ],
        }
        self.mapLigandIndex = scores.ligand.reset_index().set_index("ligand")
        self.mapReceptorIndex = scores.receptor.reset_index().set_index("receptor")
        self.mapTumorIndex = scores.tumorType.reset_index().set_index("tumorType")
        self.dfScores = scores.set_index(["ligand", "receptor"])
        self.ligandList = ["A", "B", "C"]
        self.receptorList = ["D", "E"]
        self.tumorList = ["CRC", "LUAD"]
        self.interactionList = ["cc", "nn"]
        self.ligandDic = {ligand: True for ligand in self.ligandList}
        self.receptorDic = {receptor: True for receptor in self.receptorList}
        self.ligandAllDic = {ligand: False for ligand in self.ligandList}
        self.receptorAllDic = {receptor: False for receptor in self.receptorList}
        self.interactionAllDic = {ligand: False for ligand in self.interactionList}
        self.tumorAllDic = {receptor: False for receptor in self.tumorList}
        self.deconvValues = {
            "A_LUAD": {"gene": "A", "tumorType": "LUAD", "scatterPlotData": [1, 2, 3]},
            "A_CRC": {"gene": "A", "tumorType": "CRC", "scatterPlotData": [1, 2, 3]},
            "B_LUAD": {"gene": "B", "tumorType": "LUAD", "scatterPlotData": [1, 2, 3]},
            "B_CRC": {"gene": "B", "tumorType": "CRC", "scatterPlotData": [1, 2, 3]},
            "C_LUAD": {"gene": "C", "tumorType": "LUAD", "scatterPlotData": [1, 2, 3]},
            "C_CRC": {"gene": "C", "tumorType": "CRC", "scatterPlotData": [1, 2, 3]},
            "D_LUAD": {"gene": "D", "tumorType": "LUAD", "scatterPlotData": [1, 2, 3]},
            "D_CRC": {"gene": "D", "tumorType": "CRC", "scatterPlotData": [1, 2, 3]},
            "E_LUAD": {"gene": "E", "tumorType": "LUAD", "scatterPlotData": [1, 2, 3]},
            "E_CRC": {"gene": "E", "tumorType": "CRC", "scatterPlotData": [1, 2, 3]},
        }
        self.dataFilters = [
            {"filterType": "ligands"},
            {"filterType": "receptors"},
            {"filterType": "interactions"},
            {"filterType": "tumors"},
        ]


dao.DB_INSTANCE = Mock()
