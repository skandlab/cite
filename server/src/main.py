from flask import jsonify, Blueprint, request

from . import settings
from . import service
from . import dao
from . import error

from logging import getLogger

LOGGER = getLogger(__name__)

app = Blueprint(
    "Main", __name__, url_prefix="{}/{}".format(settings.API_NAME, settings.API_VERSION)
)


REQUIRED_EXP_QUERY_PARAMETERS = ["genes", "tumortype"]


@app.route("/exp", methods=["GET"])
def endpoint_exp():
    """
    returns

    List of Dictionary, per gene
        - Dictionary
            gene: str
            tumorType: str, full form
            barplot: [
                { name: Cancer, value: number },
                { name: Stroma, value: number },
                { name: Normal (Median), value: number },
                { name: TumorBulk (Median), value: number },
            ],
            scatterplot: [{name: sample_name, value: number[purity, expression]}]
            lineplot: [
                {name: cancer, value: number[1, expression]},
                {name: stroma, value: number[0, expression]}
            ]
    """
    query_params_present = [k for k in request.values.keys()]

    for query_param in REQUIRED_EXP_QUERY_PARAMETERS:
        if query_param not in query_params_present:
            raise error.ValidationError(
                "required query parameter not present: {}".format(query_param)
            )

    list_genes = request.values.get("genes").split(",")
    tumor_type = request.values.get("tumortype")

    result = []
    for gene in list_genes:
        dic = {"gene": gene, "tumorType": settings.DATA_TUMOR_ABBR[tumor_type]}
        dic["barplot"] = [
            {"name": name, "value": value}
            for name, value in dao.deconv_exp_df.loc[(gene, tumor_type)].items()
        ]

        dic["lineplot"] = []
        for __dictionary__ in dic["barplot"]:
            name, value = __dictionary__["name"], __dictionary__["value"]
            if name == "Cancer":
                dic["lineplot"].append({"name": name, "value": [1, value]})
            if name == "Stroma":
                dic["lineplot"].append({"name": name, "value": [0, value]})

        dic["scatterplot"] = [
            {"name": name, "value": value}
            for name, value in zip(
                dao.mapping_tumor_samples[tumor_type],
                dao.samples_exp_df.loc[
                    dao.mapping_tumor_samples[tumor_type], ["cancer", gene]
                ].values.tolist(),
            )
        ]
        result.append(dic)

    return jsonify(result)


REQUIRED_SCORES_QUERY_PARAMETERS = ["ligands", "receptors"]


@app.route("/scores", methods=["GET"])
def endpoint_score():
    """
    returns data for passed query

    structure of JSON:
    - Dictionary
        ligandOptions: Dictionary
            - Dictionary
                value: str
                text: str
        receptorOptions: Dictionary
            - Dictionary
                value: str
                text: str
        scoreData - List of Dictionary
            - Dictionary
                ligand: str
                receptor: str
                values: List of Dictionary
                    - Dictionary
                        tumor_type: str
                        - [pair]: score of the pair
    """
    query_params_present = [k for k in request.values.keys()]

    for query_param in REQUIRED_SCORES_QUERY_PARAMETERS:
        if query_param not in query_params_present:
            raise error.ValidationError(
                "required query parameter not present: {}".format(query_param)
            )

    list_ligand, list_receptor = (
        request.values.get("ligands").split(","),
        request.values.get("receptors").split(","),
    )
    return jsonify(service.get_score(list_ligand, list_receptor))


@app.route("/options/checkbox", methods=["GET"])
def endpoint_checkboxOptions():
    return jsonify(dao.checkboxOptions)
