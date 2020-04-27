import pandas as pd
import numpy as np
from . import settings

df = pd.read_csv(settings.DATA_FILEPATH)

list_tumor, list_ligand, list_receptor, list_pairs = (
    df.tumor_type.unique(),
    df.ligand.unique(),
    df.receptor.unique(),
    settings.DATA_LISTPAIRS,
)
list_tumor = [tumor for tumor in list_tumor if tumor != "MEDIAN"]

df.set_index("tumor_type", inplace=True)
df = df.loc[list_tumor].reset_index()
ligand_receptor_groups = df.groupby(["ligand", "receptor"]).groups
cols = ["tumor_type"]
cols.extend(list_pairs)
