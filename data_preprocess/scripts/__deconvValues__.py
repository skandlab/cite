import pandas as pd
import json
import pickle
import numpy as np

INPUT_EXP_FILE = "source/deconv_logx+1nt_pct1.csv"
SAMPLES_EXP_FILE = "source/coding_expr_mut.pkl"
MAPPING_TUMOR_SAMPLES = "source/mapping_tumor_samples.pickle"
PURITY_FILE = "source/purity.parquet"
OUTPUT_DECONV_VALUES_FILE = "output/deconvValues.json"

with open(MAPPING_TUMOR_SAMPLES, "rb") as f:
    mapping_tumor_samples = pickle.load(f)


def run(ligandList, receptorList):
    dfExp = pd.read_csv(INPUT_EXP_FILE, usecols=["sample", "t", "C", "N", "S", "T"])
    dfExp.columns = [
        "gene",
        "tumorType",
        "Cancer",
        "Normal (Median)",
        "Stroma",
        "TumorBulk (Median)",
    ]
    # rearrange cols
    dfExp = dfExp[
        [
            "gene",
            "tumorType",
            "Cancer",
            "Stroma",
            "TumorBulk (Median)",
            "Normal (Median)",
        ]
    ]
    dfExp.set_index("gene", inplace=True)

    # keep only required genes
    geneList = np.unique([*ligandList, *receptorList])
    dfExp = dfExp.loc[geneList].round(3)
    dfExp.reset_index(inplace=True)
    dfExp.set_index(["gene", "tumorType"], inplace=True)

    dfSamplesExp = pd.read_pickle(SAMPLES_EXP_FILE)
    # aliases
    dfSamplesExp["C10orf54"] = dfSamplesExp["VSIR"]
    dfSamplesExp = dfSamplesExp[np.intersect1d(geneList, dfSamplesExp.columns)]
    purity = pd.read_parquet(PURITY_FILE)
    dfSamplesExp["cancer"] = purity.loc[
        np.intersect1d(dfSamplesExp.index, purity.index), "cancer"
    ].round(3)

    result = {}
    for [gene, tumorType] in dfExp.index:
        data = {}
        hashedKey = gene + "_" + tumorType

        data["gene"] = gene
        data["tumorType"] = tumorType

        # barplotData
        data["barplotData"] = [
            {"name": dataType, "value": value}
            for dataType, value in dfExp.loc[(gene, tumorType)].to_dict().items()
        ]

        # lineplotData
        [cancerValue, stromaValue] = dfExp.loc[
            (gene, tumorType), ["Cancer", "Stroma"]
        ].values
        data["lineplotData"] = [
            {"name": "Cancer", "value": [1, cancerValue]},
            {"name": "Stroma", "value": [0, stromaValue]},
        ]

        # scatterplotData
        data["scatterplotData"] = [
            {"name": name, "value": value}
            for name, value in zip(
                mapping_tumor_samples[tumorType],
                dfSamplesExp.loc[
                    mapping_tumor_samples[tumorType], ["cancer", gene]
                ].values.tolist(),
            )
        ]

        result[hashedKey] = data

    with open(OUTPUT_DECONV_VALUES_FILE, "w") as f:
        json.dump(
            result, f,
        )
