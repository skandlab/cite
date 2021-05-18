# Data Explanation

## folder structure

```
.
+-- source
|   +-- ...< data files >
+-- output
|   +-- ...< data files >
+-- generate_product_score.py
+-- generate_data.py
+-- __scores__.py
+-- __filters__.py
+-- __deconvValues__.py
+-- __contants__.py
```

## Source

-   pairs files

    whenever new pairs come, check whether both genes are present in expPerCellType.csv and expPerCellType.csv files.

    -   pairs_v1.txt = from umesh
    -   pairs_v2.txt = v1 + additional pairs from Neha (pairs_neha_addnl_v1.txt)
    -   pairs_v3.txt = v2 + additional pairs from Neha (pairs_neha_addnl_v2.txt)
    -   pairs_v4.txt = refactoring of pairs_v3. LAG3 was in both ligand and receptor in v3. plus other issues.

-   product score

    -   expPerCellType.csv + pairs_v< version No. >.txt --> product_score
    -   can't generate product score for
        -   NECTIN2_TIGHT
        -   PVR_TIGHT

-   mapTumorSamples

    sample id per tumor type (TCGA)

-   expPerSamples

    gene expression for each sample (TCGA)

-   purity

    sample purity (TCGA)

## Output

-   deconvValues

    -   mapping tumor to samples per tumor
    -   expression per cell type (stroma, cancer, normal, tumor median)
    -   purity (cancer purity) per samples
    -   expression per samples
    -   structure of output file :-
        -   barplotData
        -   lineplotData
        -   scatterplotData

-   filters

    -   json of filter types for frontend, structure according to frontend

-   map ligand to indexes of the dataframe

-   map receptor to indexes of the dataframe

-   map tumors to indexes of the dataframe

-   metadata

    -   json of list of ligands, receptors, interactions, tumors

-   scores
    -   dataframe of scores
