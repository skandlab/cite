import { FilterMetadata } from ".";
import { setupWorker, rest } from "msw";
import { setupServer } from "msw/node";
import { API_URL } from "../../../utils/backendRequests";

export const CheckboxOptions: { filters: FilterMetadata[] } = {
	filters: [
		{
			index: 0,
			title: "Ligands",
			popupContent: null,
			options: [
				{
					index: 0,
					isChecked: false,
					mute: false,
					value: "A2M",
				},
				{
					index: 1,
					isChecked: false,
					mute: false,
					value: "AANAT",
				},
				{
					index: 2,
					isChecked: false,
					mute: false,
					value: "ADAM12",
				},
				{
					index: 3,
					isChecked: false,
					mute: false,
					value: "ADAM15",
				},
				{
					index: 4,
					isChecked: false,
					mute: false,
					value: "ADAM17",
				},
			],
			filteredOptions: [],
		},
		{
			index: 1,
			title: "Receptors",
			popupContent: null,
			options: [
				{
					index: 0,
					isChecked: false,
					mute: false,
					value: "ACKR2",
				},
				{
					index: 1,
					isChecked: false,
					mute: false,
					value: "ACKR3",
				},
				{
					index: 2,
					isChecked: false,
					mute: false,
					value: "ACKR4",
				},
				{
					index: 3,
					isChecked: false,
					mute: false,
					value: "ACVR1",
				},
				{
					index: 4,
					isChecked: false,
					mute: false,
					value: "ACVR1B",
				},
			],
			filteredOptions: [],
		},
		{
			index: 2,
			title: "Interaction type",
			popupContent: null,
			options: [
				{
					description: "cancer-cancer",
					index: 0,
					isChecked: false,
					mute: false,
					value: "cc",
				},
				{
					description: "cancer-stroma",
					index: 1,
					isChecked: false,
					mute: false,
					value: "cs",
				},
				{
					description: "normal-normal",
					index: 2,
					isChecked: false,
					mute: false,
					value: "nn",
				},
				{
					description: "stroma-cancer",
					index: 3,
					isChecked: false,
					mute: false,
					value: "sc",
				},
				{
					description: "stroma-stroma",
					index: 4,
					isChecked: false,
					mute: false,
					value: "ss",
				},
			],
			filteredOptions: [],
		},
		{
			index: 3,
			title: "Tumor type",
			popupContent: null,
			options: [
				{
					description: "Bladder Urothelial Carcinoma",
					index: 0,
					isChecked: false,
					mute: false,
					value: "BLCA",
				},
				{
					description: "Breast invasive carcinoma",
					index: 1,
					isChecked: false,
					mute: false,
					value: "BRCA",
				},
				{
					description:
						"Cervical squamous cell carcinoma and endocervical adenocarcinoma",
					index: 2,
					isChecked: false,
					mute: false,
					value: "CESC",
				},
				{
					description: "Colorectal carcinoma",
					index: 3,
					isChecked: false,
					mute: false,
					value: "CRC",
				},
				{
					description: "Esophageal carcinoma",
					index: 4,
					isChecked: false,
					mute: false,
					value: "ESCA",
				},
				{
					description: "Glioblastoma multiforme",
					index: 5,
					isChecked: false,
					mute: false,
					value: "GBM",
				},
			],
			filteredOptions: [],
		},
	],
};

export const OptionsPerCard = CheckboxOptions["filters"].map((filter) =>
	filter.options.map((option) => option.value)
);

function generateData(
	card0: string[] = OptionsPerCard[0], // ligands
	card1: string[] = OptionsPerCard[1], // receptors
	card2: string[] = OptionsPerCard[2], // interactions
	card3: string[] = OptionsPerCard[3] // tumors
) {
	let result = [];
	for (let i = 0; i < card0.length; i++) {
		for (let j = 0; j < card1.length; j++) {
			result.push({
				ligand: card0[i],
				receptor: card1[j],
				data: {
					keys: card2,
					indexBy: "tumorType",
					xyValues: card3.map((tumorType) => {
						let tmp: { [key: string]: any } = {};
						tmp["tumorType"] = tumorType;
						card2.forEach((interaction) => {
							tmp[interaction] = Math.trunc(Math.random() * 100);
						});
						return tmp;
					}),
				},
			});
		}
	}
	return { scoreData: result };
}

const Endpoints = [
	rest.get(API_URL + "/v1/options/checkbox", (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(CheckboxOptions));
	}),
	rest.get(API_URL + "/v1/scores", (req, res, ctx) => {
		let ligands = req.url.searchParams
			.get("ligands")!
			.split(",")
			.filter((o) => o);
		if (ligands.length === 0) {
			ligands = OptionsPerCard[0];
		}

		let receptors = req.url.searchParams
			.get("receptors")!
			.split(",")
			.filter((o) => o);
		if (receptors.length === 0) {
			receptors = OptionsPerCard[1];
		}

		let interactions = req.url.searchParams
			.get("interactions")!
			.split(",")
			.filter((o) => o);
		if (interactions.length === 0) {
			interactions = OptionsPerCard[2];
		}

		let tumors = req.url.searchParams
			.get("tumors")!
			.split(",")
			.filter((o) => o);
		if (tumors.length === 0) {
			tumors = OptionsPerCard[3];
		}

		return res(
			ctx.status(200),
			ctx.json(generateData(ligands, receptors, interactions, tumors))
		);
	}),
];

export const server = setupServer(...Endpoints);

export const worker = setupWorker(...Endpoints);
