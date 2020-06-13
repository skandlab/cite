import pandas as pd
from . import __contants__ as c


def run(df, interactionList):
    df.ligand.reset_index().set_index("ligand").to_parquet(c.LIGAND_INDEX_FILE)
    df.receptor.reset_index().set_index("receptor").to_parquet(c.RECEPTOR_INDEX_FILE)
    df.tumorType.reset_index().set_index("tumorType").to_parquet(c.TUMOR_INDEX_FILE)
    df.set_index(["ligand", "receptor"]).round(3).to_parquet(c.SCORES_FILE)
