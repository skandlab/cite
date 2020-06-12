import pandas as pd
import json
from . import __contants__ as c
from . import __filters__
from . import __scores__
from . import __deconvValues__

INPUT_SCORE_FILE = "source/productScore_v2.csv"
OUTPUT_METADATA_FILE = "output/metadata.json"

df = pd.read_csv(
    INPUT_SCORE_FILE,
    usecols=[
        "ligand",
        "receptor",
        "tumorType",
        *list(c.INTERACTION_TYPE_DESCRIPTION.keys()),
    ],
)

ligandList, receptorList, interactionList, tumorList = (
    df.ligand.unique().tolist(),
    df.receptor.unique().tolist(),
    list(c.INTERACTION_TYPE_DESCRIPTION.keys()),
    df.tumorType.unique().tolist(),
)
ligandList.sort()
receptorList.sort()
tumorList.sort()
receptorList.sort()

# remove `MEDIAN` from tumorlist
df.set_index("tumorType", inplace=True)
tumorList = [tumorType for tumorType in tumorList if tumorType != "MEDIAN"]
df = df.loc[tumorList].reset_index()

__filters__.run(tumorList, ligandList, receptorList, interactionList)
print("filters done.")

__scores__.run(df, interactionList)
print("scores done.")

__deconvValues__.run(ligandList, receptorList)
print("deconv values done.")

with open(OUTPUT_METADATA_FILE, "w") as f:
    json.dump(
        {
            "ligands": ligandList,
            "receptors": receptorList,
            "interactions": interactionList,
            "tumors": tumorList,
        },
        f,
    )
print("metadata done.")
