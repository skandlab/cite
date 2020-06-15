import pytest
import pandas as pd
from . import service
from . import dao
from . import error


def test__check_if_all__allAbsent():
    results = service.__check_if_all__([], [], [], [])
    assert results[0] == ["A", "B", "C"]
    assert results[1] == ["D", "E"]
    assert results[2] == ["cc", "nn"]
    assert results[3] == ["CRC", "LUAD"]


def test__check_if_all__somePresent():
    results = service.__check_if_all__([], ["K", "Y"], [], ["LUAD"])
    assert results[0] == ["A", "B", "C"]
    assert results[1] == ["K", "Y"]
    assert results[2] == ["cc", "nn"]
    assert results[3] == ["LUAD"]


def test__validate__():
    with pytest.raises(error.ValidationError):
        service.__validate__(["A", "B", "D"], ["D", "E"], ["cc", "nn"], ["CRC", "LUAD"])
    with pytest.raises(error.ValidationError):
        service.__validate__(["A", "B", "C"], ["D", "P"], ["cc", "nn"], ["CRC", "LUAD"])
    with pytest.raises(error.ValidationError):
        service.__validate__(["A", "B", "C"], ["D", "E"], ["pp", "nn"], ["CRC", "LUAD"])
    with pytest.raises(error.ValidationError):
        service.__validate__(
            ["A", "B", "C"], ["D", "E"], ["cc", "nn"], ["CRC", "LUAD", "EGFR"]
        )
    try:
        service.__validate__(["A", "B", "C"], ["D", "E"], ["cc", "nn"], ["CRC", "LUAD"])
    except Exception:
        pytest.fail("Validation error raised.")
    # empty params
    with pytest.raises(error.ValidationError):
        service.__validate__(["A", "B", "C"], [], ["cc", "nn"], ["CRC", "LUAD", "EGFR"])


def test__generateItemIsPresent__defaultParams():
    results = service.__generateItemIsPresent__(["A", "B", "C"], ["D", "E"])

    assert results == [
        {"filterType": "ligand", "itemIsPresent": {"A": False, "B": False, "C": False}},
        {"filterType": "receptor", "itemIsPresent": {"D": False, "E": False}},
        {"filterType": "interaction", "itemIsPresent": {"cc": False, "nn": False}},
        {"filterType": "tumor", "itemIsPresent": {"CRC": False, "LUAD": False}},
    ]


def test__generateItemIsPresent__someAbsentParams():
    results = service.__generateItemIsPresent__(["A", "B"], ["D"])

    assert results == [
        {"filterType": "ligand", "itemIsPresent": {"A": False, "B": False, "C": True}},
        {"filterType": "receptor", "itemIsPresent": {"D": False, "E": True}},
        {"filterType": "interaction", "itemIsPresent": {"cc": False, "nn": False}},
        {"filterType": "tumor", "itemIsPresent": {"CRC": False, "LUAD": False}},
    ]


def test__generateItemIsPresent__someEmptyParams():
    results = service.__generateItemIsPresent__(["A", "B"], [])

    assert results == [
        {"filterType": "ligand", "itemIsPresent": {"A": False, "B": False, "C": True}},
        {"filterType": "receptor", "itemIsPresent": {"D": True, "E": True}},
        {"filterType": "interaction", "itemIsPresent": {"cc": False, "nn": False}},
        {"filterType": "tumor", "itemIsPresent": {"CRC": False, "LUAD": False}},
    ]


def test_get_score_default():
    results, items = service.get_score([], [], [], [])
    assert len(results) == 6
    assert len(items) == 4
    assert results == [
        {
            "ligand": "A",
            "receptor": "D",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "A",
            "receptor": "E",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "B",
            "receptor": "D",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "B",
            "receptor": "E",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "C",
            "receptor": "D",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "C",
            "receptor": "E",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
    ]
    assert items == [
        {"filterType": "ligand", "itemIsPresent": {"A": False, "B": False, "C": False}},
        {"filterType": "receptor", "itemIsPresent": {"D": False, "E": False}},
        {"filterType": "interaction", "itemIsPresent": {"cc": False, "nn": False}},
        {"filterType": "tumor", "itemIsPresent": {"CRC": False, "LUAD": False}},
    ]


def test_get_score_notDefault():
    results, items = service.get_score(["A", "C"], [], [], [])
    assert len(results) == 4
    assert len(items) == 4
    assert results == [
        {
            "ligand": "A",
            "receptor": "D",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "A",
            "receptor": "E",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "C",
            "receptor": "D",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "C",
            "receptor": "E",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 1, "nn": 3},
                    {"tumorType": "LUAD", "cc": 1, "nn": 3},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
    ]
    assert items == [
        {"filterType": "ligand", "itemIsPresent": {"A": False, "B": True, "C": False}},
        {"filterType": "receptor", "itemIsPresent": {"D": False, "E": False}},
        {"filterType": "interaction", "itemIsPresent": {"cc": False, "nn": False}},
        {"filterType": "tumor", "itemIsPresent": {"CRC": False, "LUAD": False}},
    ]
