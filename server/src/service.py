from typing import List
import pandas as pd
import numpy as np
from . import dao
from . import error
from . import settings


def __check_if_all__(
    ligandList: List[str],
    receptorList: List[str],
    interactionList: List[str],
    tumorList: List[str],
):
    if len(ligandList) == 1 and len(ligandList[0]) == 0:
        ligandList = dao.ligandList
    if len(receptorList) == 1 and len(receptorList[0]) == 0:
        receptorList = dao.receptorList
    if len(interactionList) == 1 and len(interactionList[0]) == 0:
        interactionList = dao.interactionList
    if len(tumorList) == 1 and len(tumorList[0]) == 0:
        tumorList = dao.tumorList
    return ligandList, receptorList, interactionList, tumorList


def __validate__(
    ligandList: List[str],
    receptorList: List[str],
    interactionList: List[str],
    tumorList: List[str],
):
    if len(np.setdiff1d(ligandList, dao.ligandList)) != 0:
        raise error.ValidationError("Invalid ligand in query: {}".format(ligandList))
    if len(np.setdiff1d(receptorList, dao.receptorList)) != 0:
        raise error.ValidationError(
            "Invalid receptor in query: {}".format(receptorList)
        )
    if len(np.setdiff1d(interactionList, dao.interactionList)) != 0:
        raise error.ValidationError(
            "Invalid interaction in query: {}".format(interactionList)
        )
    if len(np.setdiff1d(tumorList, dao.tumorList)) != 0:
        raise error.ValidationError("Invalid tumor in query: {}".format(tumorList))


# TODO: caching machinism
def get_score(
    params_ligandList: List[str],
    params_receptorList: List[str],
    params_interactionList: List[str],
    params_tumorList: List[str],
):
    if (
        params_ligandList == [""]
        and params_receptorList == [""]
        and params_interactionList == [""]
        and params_tumorList == [""]
    ):
        return dao.defaultScores

    ligandList, receptorList, interactionList, tumorList = __check_if_all__(
        params_ligandList, params_receptorList, params_interactionList, params_tumorList
    )
    __validate__(ligandList, receptorList, interactionList, tumorList)

    indexes = np.intersect1d(
        dao.mapLigandIndex.loc[ligandList, "index"].values,
        dao.mapReceptorIndex.loc[receptorList, "index"].values,
    )
    indexes = np.intersect1d(indexes, dao.mapTumorIndex.loc[tumorList, "index"].values)

    tmpdf = dao.dfScores.iloc[indexes][["tumorType", *interactionList]]

    pairs = np.sort(tmpdf.index.unique())
    # sort scores according to pairs
    scores = tmpdf.loc[pairs].to_dict("records")

    result = []
    index = 0
    for [ligand, receptor] in pairs:
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
    return result
