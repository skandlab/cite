import pandas as pd

OUTPUT_LIGAND_INDEX_FILE = "output/map_ligand_index.parquet"
OUTPUT_RECEPTOR_INDEX_FILE = "output/map_receptor_index.parquet"
OUTPUT_TUMOR_INDEX_FILE = "output/map_tumor_index.parquet"
OUTPUT_SCORES_FILE = "output/scores.parquet"


def run(df, interactionList):
    df.ligand.reset_index().set_index("ligand").to_parquet(OUTPUT_LIGAND_INDEX_FILE)
    df.receptor.reset_index().set_index("receptor").to_parquet(
        OUTPUT_RECEPTOR_INDEX_FILE
    )
    df.tumorType.reset_index().set_index("tumorType").to_parquet(
        OUTPUT_TUMOR_INDEX_FILE
    )
    df.set_index(["ligand", "receptor"]).round(3).to_parquet(OUTPUT_SCORES_FILE)
