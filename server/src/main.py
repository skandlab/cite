from typing import Dict
from flask import jsonify, Blueprint, request
from werkzeug.datastructures import MultiDict
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


def helpers(requestParams: MultiDict, requiredParams: Dict):
    for query_param in requiredParams.keys():
        if query_param not in requestParams:
            raise error.ValidationError(
                "required query parameter not present: {}".format(query_param)
            )

    parsedParams = {}
    for queryParam, queryParamType in requiredParams.items():
        value = requestParams.get(queryParam)
        if queryParamType == bool:
            parsedParams[queryParam] = value.lower() == "true"
        elif queryParamType == list:
            parsedParams[queryParam] = [val for val in value.split(",") if val != ""]
        else:
            parsedParams[queryParam] = value
    return parsedParams


REQUIRED_EXP_QUERY_PARAMETERS = {"genes": list, "tumortype": str}


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
    parsedParams = helpers(request.args, REQUIRED_EXP_QUERY_PARAMETERS,)

    geneList, tumorType = (
        parsedParams["genes"],
        parsedParams["tumortype"],
    )

    return jsonify(
        [
            dao.DB_INSTANCE.deconvValues["{}_{}".format(geneList[0], tumorType)],
            dao.DB_INSTANCE.deconvValues["{}_{}".format(geneList[1], tumorType)],
        ]
    )


REQUIRED_SCORES_QUERY_PARAMETERS = {
    "ligands": list,
    "receptors": list,
    "interactions": list,
    "tumors": list,
}


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
    parsedParams = helpers(request.args, REQUIRED_SCORES_QUERY_PARAMETERS)

    ligandList, receptorList, interactionList, tumorList = (
        parsedParams["ligands"],
        parsedParams["receptors"],
        parsedParams["interactions"],
        parsedParams["tumors"],
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
    return jsonify(dao.DB_INSTANCE.dataFilters)
