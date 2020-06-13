import pandas as pd
import numpy as np

from . import __contants__ as c

df = pd.read_csv(c.EXP_PER_CELLTYPE_FILE)

list_tumor_type = df.t.values[:20].tolist()

df.columns = ["sample", "tumorType", "cancer", "normal", "stroma", "T", "pct"]
df = df[["sample", "tumorType", "cancer", "normal", "stroma"]]
df.set_index(["sample", "tumorType"], inplace=True)

df = pd.DataFrame(np.exp2(df.values) - 1, index=df.index, columns=df.columns)


def func(ligand, receptor):
    df_ligand = df.loc[ligand].loc[list_tumor_type]
    df_receptor = df.loc[receptor].loc[list_tumor_type]
    cc = df_ligand["cancer"] * df_receptor["cancer"]
    cs = df_ligand["cancer"] * df_receptor["stroma"]
    nn = df_ligand["normal"] * df_receptor["normal"]
    ss = df_ligand["stroma"] * df_receptor["stroma"]
    sc = df_ligand["stroma"] * df_receptor["cancer"]

    _sum = cc + cs + nn + ss + sc

    _df = (
        pd.concat([cc / _sum, cs / _sum, nn / _sum, ss / _sum, sc / _sum], axis=1) * 100
    )
    _df.columns = ["cc", "cs", "nn", "ss", "sc"]
    _df["ligand"] = [ligand] * len(list_tumor_type)
    _df["receptor"] = [receptor] * len(list_tumor_type)
    _df = _df.round(3)
    return _df.reset_index()


l = []
with open(c.PAIRS_FILE, "r") as f:
    line = f.readline()
    while line:
        try:
            l.append(func(*line.strip().split("_")))
        except KeyError:
            print("{} not present".format(line))
        line = f.readline()

df = pd.concat(l)
df.drop_duplicates(inplace=True)
df.to_csv(c.INPUT_SCORE_FILE, index=False)
