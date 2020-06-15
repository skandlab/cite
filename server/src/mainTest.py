import pytest
import json
from flask import Flask
from . import main

app = Flask(__name__)
app.register_blueprint(main.APP)
testClient = app.test_client()


def test_deconv():
    resp = testClient.get("/server/v1/deconv?genes=A,D&tumortype=CRC")
    data = json.loads(resp.data)
    assert resp.status_code == 200
    assert data == [
        {"gene": "A", "tumorType": "CRC", "scatterPlotData": [1, 2, 3]},
        {"gene": "D", "tumorType": "CRC", "scatterPlotData": [1, 2, 3]},
    ]


def test_scores():
    resp = testClient.get(
        "/server/v1/scores?ligands=A,B&receptors=&interactions=cc&tumors="
    )
    data = json.loads(resp.data)
    assert resp.status_code == 200
    assert data == {
        "itemIsPresent": [
            {
                "filterType": "ligand",
                "itemIsPresent": {"A": False, "B": False, "C": True},
            },
            {"filterType": "receptor", "itemIsPresent": {"D": False, "E": False}},
            {"filterType": "interaction", "itemIsPresent": {"cc": False, "nn": False}},
            {"filterType": "tumor", "itemIsPresent": {"CRC": False, "LUAD": False}},
        ],
        "scores": [
            {
                "data": {
                    "indexBy": "tumorType",
                    "keys": ["cc"],
                    "xyValues": [
                        {"cc": 12, "tumorType": "CRC"},
                        {"cc": 14, "tumorType": "LUAD"},
                    ],
                },
                "ligand": "B",
                "receptor": "E",
            },
            {
                "data": {
                    "indexBy": "tumorType",
                    "keys": ["cc"],
                    "xyValues": [
                        {"cc": 8, "tumorType": "CRC"},
                        {"cc": 10, "tumorType": "LUAD"},
                    ],
                },
                "ligand": "B",
                "receptor": "D",
            },
            {
                "data": {
                    "indexBy": "tumorType",
                    "keys": ["cc"],
                    "xyValues": [
                        {"cc": 4, "tumorType": "CRC"},
                        {"cc": 6, "tumorType": "LUAD"},
                    ],
                },
                "ligand": "A",
                "receptor": "E",
            },
            {
                "data": {
                    "indexBy": "tumorType",
                    "keys": ["cc"],
                    "xyValues": [
                        {"cc": 0, "tumorType": "CRC"},
                        {"cc": 2, "tumorType": "LUAD"},
                    ],
                },
                "ligand": "A",
                "receptor": "D",
            },
        ],
    }


def test_checkbox():
    resp = testClient.get("/server/v1/options/checkbox")
    data = json.loads(resp.data)
    assert resp.status_code == 200
    assert data == [
        {"filterType": "ligands"},
        {"filterType": "receptors"},
        {"filterType": "interactions"},
        {"filterType": "tumors"},
    ]
