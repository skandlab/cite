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


REQUIRED_QUERY_PARAMETERS = ["list_ligand", "list_receptor", "list_tumor", "list_pairs"]


@app.route("/data", methods=["GET"])
def data():
    """
    returns data for passed query

    structure of JSON:
    - List of Dictionary
        - Dictionary
            ligand_receptor: name of the ligand receptor combination
            values: List of Dictionary
                - Dictionary
                    tumor_type: str
                    - [pair]: score of the pair
    """
    query_params_present = [i for i in request.values.keys()]

    for query_param in REQUIRED_QUERY_PARAMETERS:
        if query_param not in query_params_present:
            raise error.ValidationError(
                "required query parameter not present: {}".format(query_param)
            )

    list_ligand, list_receptor, list_tumor, list_pairs = (
        request.values.get("list_ligand").split(","),
        request.values.get("list_receptor").split(","),
        request.values.get("list_tumor").split(","),
        request.values.get("list_pairs").split(","),
    )
    return jsonify(
        service.get_score(list_tumor, list_pairs, list_ligand, list_receptor)
    )


@app.route("/metadata", methods=["GET"])
def metadata():
    return jsonify(
        {
            "ligandOptions": [
                {"isChecked": False, "value": ligand} for ligand in dao.list_ligand
            ],
            "receptorOptions": [
                {"isChecked": False, "value": receptor}
                for receptor in dao.list_receptor
            ],
            "tumorOptions": [
                {"isChecked": False, "value": tumor} for tumor in dao.list_tumor
            ],
            "pairsOptions": [
                {"isChecked": False, "value": pair} for pair in dao.list_pairs
            ],
        }
    )
