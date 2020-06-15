from typing import Dict
from logging import getLogger
from flask import jsonify, Blueprint, request
from werkzeug.datastructures import MultiDict

from . import settings
from . import service
from . import dao
from . import error

LOGGER = getLogger(__name__)

APP = Blueprint(
    "Main", __name__, url_prefix="{}/{}".format(settings.API_NAME, settings.API_VERSION)
)


def helpers(requestParams: MultiDict, requiredParams: Dict):
    for queryParam in requiredParams.keys():
        if queryParam not in requestParams:
            raise error.ValidationError(
                "required query parameter not present: {}".format(queryParam)
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


@APP.route("/deconv", methods=["GET"])
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


@APP.route("/scores", methods=["GET"])
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

    scores, itemIsPresent = service.get_score(
        ligandList, receptorList, interactionList, tumorList
    )
    return jsonify({"scores": scores, "itemIsPresent": itemIsPresent})


@APP.route("/options/checkbox", methods=["GET"])
def endpoint_checkboxoptions():
    """
    Array<{
        filterIndex: number;
        title: string;
        popupContent: SemanticShorthandContent;
        options: ColumnBrowserType[];
        filteredOptions: ColumnBrowserType[];
    }>
    """
    return jsonify(dao.DB_INSTANCE.dataFilters)
