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


REQUIRED_QUERY_PARAMETERS = ["list_ligand", "list_receptor"]


@app.route("/data", methods=["GET"])
def data():
    """
    returns data for passed query

    structure of JSON:
    - List of Dictionary
        - Dictionary
            ligand: str
            receptor: str
            values: List of Dictionary
                - Dictionary
                    tumor_type: str
                    - [pair]: score of the pair
    """
    query_params_present = [k for k in request.values.keys()]

    for query_param in REQUIRED_QUERY_PARAMETERS:
        if query_param not in query_params_present:
            raise error.ValidationError(
                "required query parameter not present: {}".format(query_param)
            )

    list_ligand, list_receptor = (
        request.values.get("list_ligand").split(","),
        request.values.get("list_receptor").split(","),
    )
    return jsonify(service.get_score(list_ligand, list_receptor))


@app.route("/metadata", methods=["GET"])
def metadata():
    return jsonify(
        {
            "tumorOptions": [
                {"isChecked": False, "value": tumor_type}
                for tumor_type in dao.list_tumor_type
            ],
            "pairsOptions": [
                {"isChecked": False, "value": interaction_type}
                for interaction_type in dao.list_interaction_type
            ],
        }
    )
