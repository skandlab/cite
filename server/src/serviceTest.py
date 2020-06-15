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
            "ligand": "C",
            "receptor": "E",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 20, "nn": 21},
                    {"tumorType": "LUAD", "cc": 22, "nn": 23},
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
                    {"tumorType": "CRC", "cc": 16, "nn": 17},
                    {"tumorType": "LUAD", "cc": 18, "nn": 19},
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
                    {"tumorType": "CRC", "cc": 12, "nn": 13},
                    {"tumorType": "LUAD", "cc": 14, "nn": 15},
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
                    {"tumorType": "CRC", "cc": 8, "nn": 9},
                    {"tumorType": "LUAD", "cc": 10, "nn": 11},
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
                    {"tumorType": "CRC", "cc": 4, "nn": 5},
                    {"tumorType": "LUAD", "cc": 6, "nn": 7},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "A",
            "receptor": "D",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 0, "nn": 1},
                    {"tumorType": "LUAD", "cc": 2, "nn": 3},
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
            "ligand": "C",
            "receptor": "E",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 20, "nn": 21},
                    {"tumorType": "LUAD", "cc": 22, "nn": 23},
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
                    {"tumorType": "CRC", "cc": 16, "nn": 17},
                    {"tumorType": "LUAD", "cc": 18, "nn": 19},
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
                    {"tumorType": "CRC", "cc": 4, "nn": 5},
                    {"tumorType": "LUAD", "cc": 6, "nn": 7},
                ],
                "keys": ["cc", "nn"],
                "indexBy": "tumorType",
            },
        },
        {
            "ligand": "A",
            "receptor": "D",
            "data": {
                "xyValues": [
                    {"tumorType": "CRC", "cc": 0, "nn": 1},
                    {"tumorType": "LUAD", "cc": 2, "nn": 3},
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
