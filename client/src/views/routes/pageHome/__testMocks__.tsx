import { setupWorker, rest } from "msw";
import { setupServer } from "msw/node";
import { API_URL, FilterMetadata } from "../../../utils/backendRequests";
import { DeconvData, CheckboxOptions } from "./__mock_data__.json";

export const OptionsPerCard = (CheckboxOptions[
	"filters"
] as FilterMetadata[]).map((filter) =>
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
	return result;
}

const Endpoints = [
	rest.get(API_URL + "/v1/options/checkbox", (req, res, ctx) => {
		return res(ctx.status(200), ctx.json(CheckboxOptions["filters"]));
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
	rest.get(API_URL + "/v1/deconv", (req, res, ctx) => {
		let [gene1, gene2] = req.url.searchParams
			.get("genes")!
			.split(",")
			.filter((o) => o);

		return res(
			ctx.status(200),
			ctx.json([
				{ ...DeconvData[0], gene: gene1 },
				{ ...DeconvData[1], gene: gene2 },
			])
		);
	}),
];

export const server = setupServer(...Endpoints);

export const worker = setupWorker(...Endpoints);
