from typing import List
import pandas as pd
import numpy as np
from . import dao
from . import error


def __check_if_all__(
    list_ligand: List[str], list_receptor: List[str],
):
    if len(list_ligand) == 1 and len(list_ligand[0]) == 0:
        list_ligand = dao.list_ligand
    if len(list_receptor) == 1 and len(list_receptor[0]) == 0:
        list_receptor = dao.list_receptor
    return list_ligand, list_receptor


def __validate__(
    list_ligand: List[str], list_receptor: List[str],
):
    if len(np.setdiff1d(list_ligand, dao.list_ligand)) != 0:
        raise error.ValidationError("Invalid ligand in query: {}".format(list_ligand))
    if len(np.setdiff1d(list_receptor, dao.list_receptor)) != 0:
        raise error.ValidationError(
            "Invalid receptor in query: {}".format(list_receptor)
        )


def get_score(
    list_ligand: List[str], list_receptor: List[str],
):
    list_ligand, list_receptor = __check_if_all__(list_ligand, list_receptor)
    __validate__(list_ligand, list_receptor)

    ligandOptions = []
    receptorOptions = []
    filteredData = []
    alreadySelectedLigand = []
    alreadySelectedReceptor = []
    for dic in dao.data_score:
        ligand, receptor = dic["ligand"], dic["receptor"]
        if ligand in list_ligand and receptor in list_receptor:
            if ligand not in alreadySelectedLigand:
                ligandOptions.append({"isChecked": False, "value": ligand})
                alreadySelectedLigand.append(ligand)
            if receptor not in alreadySelectedReceptor:
                receptorOptions.append({"isChecked": False, "value": receptor})
                alreadySelectedReceptor.append(receptor)
            filteredData.append(dic)
    return {
        "ligandOptions": ligandOptions,
        "receptorOptions": receptorOptions,
        "scoreData": filteredData,
    }
