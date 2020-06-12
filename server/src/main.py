from flask import jsonify, Blueprint, request
import numpy as np

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


@app.route("/deconv", methods=["GET"])
def endpoint_exp():
    """
    array of length 2
    
    Array<{
        gene: string;
        tumorType: string;
        scatterPlotData: {
            name: string;
            value: [number, number];
        }[];
        linePlotData: {
            name: string;
            value: [number, number];
        }[];
        barPlotData: {
            name: string;
            value: number;
        }[];
    }>
    """
    query_params_present = [k for k in request.values.keys()]

    for query_param in REQUIRED_EXP_QUERY_PARAMETERS:
        if query_param not in query_params_present:
            raise error.ValidationError(
                "required query parameter not present: {}".format(query_param)
            )

    geneList = request.values.get("genes").split(",")
    tumorType = request.values.get("tumortype")

    return jsonify(
        [
            dao.deconvValues["{}_{}".format(geneList[0], tumorType)],
            dao.deconvValues["{}_{}".format(geneList[1], tumorType)],
        ]
    )


REQUIRED_SCORES_QUERY_PARAMETERS = ["ligands", "receptors", "interactions", "tumors"]


@app.route("/scores", methods=["GET"])
def endpoint_score():
    """
    Array<{
        ligand: string;
        receptor: string;
        data: HeatMapDataType;
    }>

    where,
    HeatMapDataType = {
        xyValues: { [key: string]: string }[];
        keys: string[];
        indexBy: string;
    }
    """
    query_params_present = [k for k in request.values.keys()]

    for query_param in REQUIRED_SCORES_QUERY_PARAMETERS:
        if query_param not in query_params_present:
            raise error.ValidationError(
                "required query parameter not present: {}".format(query_param)
            )

    ligandList, receptorList, interactionList, tumorList = (
        request.values.get("ligands").strip().split(","),
        request.values.get("receptors").strip().split(","),
        request.values.get("interactions").strip().split(","),
        request.values.get("tumors").strip().split(","),
    )

    return jsonify(
        service.get_score(ligandList, receptorList, interactionList, tumorList)
    )


@app.route("/options/checkbox", methods=["GET"])
def endpoint_checkboxOptions():
    """
    Array<{
        index: number;
        title: string;
        popupContent: SemanticShorthandContent;
        options: ColumnBrowserType[];
        filteredOptions: ColumnBrowserType[];
    }>
    """
    return jsonify(dao.dataFilters)
