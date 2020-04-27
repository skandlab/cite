from typing import List
import pandas as pd
import numpy as np
from . import dao
from . import error


def __check_if_all__(
    list_tumor: List[str],
    list_pairs: List[str],
    list_ligand: List[str],
    list_receptor: List[str],
):
    if len(list_ligand) == 1 and len(list_ligand[0]) == 0:
        list_ligand = dao.list_ligand
    if len(list_receptor) == 1 and len(list_receptor[0]) == 0:
        list_receptor = dao.list_receptor
    if len(list_pairs) == 1 and len(list_pairs[0]) == 0:
        list_pairs = dao.list_pairs
    if len(list_tumor) == 1 and len(list_tumor[0]) == 0:
        list_tumor = dao.list_tumor
    return list_tumor, list_pairs, list_ligand, list_receptor


def __generate_ligand_receptor_pairs__(
    list_ligand: List[str], list_receptor: List[str]
):
    return [(ligand, receptor) for ligand, receptor in zip(list_ligand, list_receptor)]


def __validate__(
    list_tumor: List[str],
    list_pairs: List[str],
    list_ligand: List[str],
    list_receptor: List[str],
):
    if len(np.setdiff1d(list_tumor, dao.list_tumor)) != 0:
        raise error.ValidationError("Invalid tumor in query: {}".format(list_tumor))
    if len(np.setdiff1d(list_pairs, dao.list_pairs)) != 0:
        raise error.ValidationError("Invalid pair in query: {}".format(list_pairs))
    if len(np.setdiff1d(list_ligand, dao.list_ligand)) != 0:
        raise error.ValidationError("Invalid ligand in query: {}".format(list_ligand))
    if len(np.setdiff1d(list_receptor, dao.list_receptor)) != 0:
        raise error.ValidationError(
            "Invalid receptor in query: {}".format(list_receptor)
        )


def get_score(
    list_tumor: List[str],
    list_pairs: List[str],
    list_ligand: List[str],
    list_receptor: List[str],
):
    list_tumor, list_pairs, list_ligand, list_receptor = __check_if_all__(
        list_tumor, list_pairs, list_ligand, list_receptor
    )
    __validate__(list_tumor, list_pairs, list_ligand, list_receptor)

    return [
        {
            "ligand": ligand,
            "receptor": receptor,
            "values": dao.df.loc[indexes, dao.cols].to_dict(orient="records"),
        }
        for [ligand, receptor], indexes in dao.ligand_receptor_groups.items()
        if ligand in list_ligand and receptor in list_receptor
    ]
