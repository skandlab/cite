import json
from . import settings

with open(settings.DATA_FILEPATH, "r") as f:
    data = json.load(f)

with open(settings.DATA_METADATA_FILEPATH, "r") as f:
    __tmp__ = json.load(f)
    list_ligand, list_receptor, list_tumor_type, list_interaction_type = (
        __tmp__["ligand"],
        __tmp__["receptor"],
        __tmp__["tumorType"],
        __tmp__["interactionType"],
    )
