from typing import List
import numpy as np
from . import dao
from . import error


def __check_if_all__(
    ligandList: List[str],
    receptorList: List[str],
    interactionList: List[str],
    tumorList: List[str],
):
    if not ligandList:
        ligandList = dao.DB_INSTANCE.ligandList
    if not receptorList:
        receptorList = dao.DB_INSTANCE.receptorList
    if not interactionList:
        interactionList = dao.DB_INSTANCE.interactionList
    if not tumorList:
        tumorList = dao.DB_INSTANCE.tumorList
    return ligandList, receptorList, interactionList, tumorList


def __validate__(
    ligandList: List[str],
    receptorList: List[str],
    interactionList: List[str],
    tumorList: List[str],
):
    if len(np.setdiff1d(ligandList, dao.DB_INSTANCE.ligandList)) != 0:
        raise error.ValidationError("Invalid ligand in query: {}".format(ligandList))
    if len(np.setdiff1d(receptorList, dao.DB_INSTANCE.receptorList)) != 0:
        raise error.ValidationError(
            "Invalid receptor in query: {}".format(receptorList)
        )
    if len(np.setdiff1d(interactionList, dao.DB_INSTANCE.interactionList)) != 0:
        raise error.ValidationError(
            "Invalid interaction in query: {}".format(interactionList)
        )
    if len(np.setdiff1d(tumorList, dao.DB_INSTANCE.tumorList)) != 0:
        raise error.ValidationError("Invalid tumor in query: {}".format(tumorList))


# TODO: caching machinism
def get_score(
    paramsLigandList: List[str],
    paramsReceptorList: List[str],
    paramsInteractionList: List[str],
    paramsTumorList: List[str],
):
    if (
        paramsLigandList == []
        and paramsReceptorList == []
        and paramsInteractionList == []
        and paramsTumorList == []
    ):
        return (
            dao.DB_INSTANCE.defaultScores["scores"],
            dao.DB_INSTANCE.defaultScores["itemIsPresent"],
        )

    ligandList, receptorList, interactionList, tumorList = __check_if_all__(
        paramsLigandList, paramsReceptorList, paramsInteractionList, paramsTumorList
    )
    __validate__(ligandList, receptorList, interactionList, tumorList)

    # get indexes of the scores dataframe to query
    indexes = np.intersect1d(
        dao.DB_INSTANCE.mapTumorIndex.loc[tumorList, "index"].values,
        np.intersect1d(
            dao.DB_INSTANCE.mapLigandIndex.loc[ligandList, "index"].values,
            dao.DB_INSTANCE.mapReceptorIndex.loc[receptorList, "index"].values,
        ),
    )

    # create a slice of the scores dataframe based on above indices and interaction types
    tmpdf = dao.DB_INSTANCE.dfScores.iloc[indexes][["tumorType", *interactionList]]

    pairs = np.sort(tmpdf.index.unique())
    # sort scores according to pairs
    scores = tmpdf.loc[pairs].to_dict("records")

    result = []
    index = 0
    ligandSet = set()
    receptorSet = set()
    for [ligand, receptor] in pairs:
        ligandSet.add(ligand)
        receptorSet.add(receptor)
        result.append(
            {
                "ligand": ligand,
                "receptor": receptor,
                "data": {
                    "xyValues": scores[index : index + len(tumorList)],
                    "keys": interactionList,
                    "indexBy": "tumorType",
                },
            }
        )
        index = index + len(tumorList)
    return result, __generateItemIsPresent__(ligandSet, receptorSet)


def __generateItemIsPresent__(
    paramsLigandList: List[str], paramsReceptorList: List[str]
):
    ldic = dao.DB_INSTANCE.ligandDic.copy()
    rdic = dao.DB_INSTANCE.receptorDic.copy()
    if len(paramsLigandList) == len(dao.DB_INSTANCE.ligandList):
        ldic = dao.DB_INSTANCE.ligandAllDic
    else:
        for ligand in paramsLigandList:
            ldic[ligand] = False
    if len(paramsReceptorList) == len(dao.DB_INSTANCE.receptorList):
        rdic = dao.DB_INSTANCE.receptorAllDic
    else:
        for receptor in paramsReceptorList:
            rdic[receptor] = False
    return [
        {"filterType": "ligand", "itemIsPresent": ldic},
        {"filterType": "receptor", "itemIsPresent": rdic},
        {
            "filterType": "interaction",
            "itemIsPresent": dao.DB_INSTANCE.interactionAllDic,
        },
        {"filterType": "tumor", "itemIsPresent": dao.DB_INSTANCE.tumorAllDic},
    ]
