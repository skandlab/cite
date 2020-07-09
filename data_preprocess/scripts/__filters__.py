import json

from . import __contants__ as c


def run(tumorList, ligandList, receptorList, interactionList):
    with open(c.FILTERS_FILE, "w") as f:
        json.dump(
            [
                {
                    "filterIndex": 0,
                    "title": "Ligands",
                    "popupContent": None,
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
                    "filterIndex": 1,
                    "title": "Receptors",
                    "popupContent": None,
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
                    "filterIndex": 2,
                    "title": "Interaction Type",
                    "popupContent": "<p>Read more on interaction types in the <a href='/ui/about' target='_blank' rel='noopener noreferrer' >about page</a> <sup><Icon name='external alternate' size='small' fitted /></sup>.</p>",
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
                    "filterIndex": 3,
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
