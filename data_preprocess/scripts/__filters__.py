import json

from . import __contants__ as c


def run(tumorList, ligandList, receptorList, interactionList):
    with open(c.FILTERS_FILE, "w") as f:
        json.dump(
            [
                {
                    "index": 0,
                    "title": "Ligands",
                    "popupContent": "<p>if no associated heatmap present then gene will be dimmed</p>",
                    "options": [
                        {
                            "index": index,
                            "isChecked": False,
                            "mute": False,
                            "value": ligand,
                        }
                        for index, ligand in enumerate(ligandList)
                    ],
                    "filteredOptions": [],
                },
                {
                    "index": 1,
                    "title": "Receptors",
                    "popupContent": "<p>if no associated heatmap present then gene will be dimmed</p>",
                    "options": [
                        {
                            "index": index,
                            "isChecked": False,
                            "mute": False,
                            "value": receptor,
                        }
                        for index, receptor in enumerate(receptorList)
                    ],
                    "filteredOptions": [],
                },
                {
                    "index": 2,
                    "title": "Interaction Type",
                    "popupContent": "<p>read more on interaction type in <a href='/ui/about' target='_blank' rel='noopener noreferrer' >about page</a> <sup><Icon name='external alternate' size='small' fitted /></sup></p>",
                    "options": [
                        {
                            "index": index,
                            "isChecked": False,
                            "mute": False,
                            "value": interaction,
                            "description": c.INTERACTION_TYPE_DESCRIPTION[interaction],
                        }
                        for index, interaction in enumerate(interactionList)
                    ],
                    "filteredOptions": [],
                },
                {
                    "index": 3,
                    "title": "Tumor Type",
                    "popupContent": None,
                    "options": [
                        {
                            "index": index,
                            "isChecked": False,
                            "mute": False,
                            "value": tumor,
                            "description": c.TUMOR_TYPE_DESCRIPTION[tumor],
                        }
                        for index, tumor in enumerate(tumorList)
                    ],
                    "filteredOptions": [],
                },
            ],
            f,
        )
