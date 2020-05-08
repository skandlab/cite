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


isChecked = lambda item, list_items: True if item in list_items else False


def get_score(params_list_ligand: List[str], params_list_receptor: List[str]):
    list_ligand, list_receptor = __check_if_all__(
        params_list_ligand, params_list_receptor
    )
    __validate__(list_ligand, list_receptor)

    filteredData = []
    alreadySelectedLigand = []
    alreadySelectedReceptor = []
    for dic in dao.data_score:
        ligand, receptor = dic["ligand"], dic["receptor"]

        # if both ligand and receptor in the data point
        # add the score to the final results array
        if ligand in list_ligand and receptor in list_receptor:
            filteredData.append(dic)

            if ligand not in alreadySelectedLigand:
                alreadySelectedLigand.append(ligand)
            if receptor not in alreadySelectedReceptor:
                alreadySelectedReceptor.append(receptor)

    alreadySelectedLigand.sort()
    alreadySelectedReceptor.sort()

    ligandOptions = [
        {
            "isChecked": isChecked(ligand, params_list_ligand),
            "index": index,
            "value": ligand,
            "mute": False,
        }
        for index, ligand in enumerate(alreadySelectedLigand)
    ]
    receptorOptions = [
        {
            "isChecked": isChecked(receptor, params_list_receptor),
            "index": index,
            "value": receptor,
            "mute": False,
        }
        for index, receptor in enumerate(alreadySelectedReceptor)
    ]

    index = len(ligandOptions)
    for ligand in dao.list_ligand:
        if ligand not in alreadySelectedLigand:
            ligandOptions.append(
                {"isChecked": False, "value": ligand, "mute": True, "index": index}
            )
            index += 1

    index = len(receptorOptions)
    for receptor in dao.list_receptor:
        if receptor not in alreadySelectedReceptor:
            receptorOptions.append(
                {"isChecked": False, "value": receptor, "mute": True, "index": index}
            )

    return {
        "ligandOptions": ligandOptions,
        "receptorOptions": receptorOptions,
        "scoreData": filteredData,
    }
