import { HeatMapDataType } from "../views/plots/plotHeatmap";
import { SemanticShorthandContent } from "semantic-ui-react/dist/commonjs/generic";
import { ColumnBrowserType } from "../views/hoc/columnBrowser";
import { browserHistory } from "./browserHistory";
import { ROUTES } from "./routes";

export const API_URL = "http://localhost:5000/server";

export type FilterMetadata = {
	index: number;
	title: string;
	popupContent: SemanticShorthandContent;
	options: ColumnBrowserType[];
	filteredOptions: ColumnBrowserType[];
};

export type HeatmapCardType = {
	ligand: string;
	receptor: string;
	data: HeatMapDataType;
};

export type DeconvDataType = {
	gene: string;
	tumorType: string;
	scatterplotData: {
		name: string;
		value: [number, number];
	}[];
	lineplotData: {
		name: string;
		value: [number, number];
	}[];
	barplotData: {
		name: string;
		value: number;
	}[];
};

const API_CHECKBOX_OPTIONS = () => API_URL + "/v1/options/checkbox";
const API_SCORES = (args: string[][]) =>
	API_URL +
	"/v1/scores?ligands=" +
	args[0].join(",") +
	"&receptors=" +
	args[1].join(",") +
	"&interactions=" +
	args[2].join(",") +
	"&tumors=" +
	args[3].join(",");

export const requestCheckboxOptionsAndScores = (
	callBack: (data1: FilterMetadata[], data: HeatmapCardType[]) => void
) =>
	Promise.all([
		fetch(API_CHECKBOX_OPTIONS(), {
			method: "GET",
		}),
		fetch(API_SCORES([[], [], [], []]), {
			method: "GET",
		}),
	])
		.then(async (resp) => {
			const respData1 = await resp[0].json();
			const respData2 = await resp[1].json();
			callBack(
				respData1 as FilterMetadata[],
				respData2 as HeatmapCardType[]
			);
		})
		.catch((_) => browserHistory.push(ROUTES.Error.push()));

export const requestScores = (
	args: string[][],
	callBack: (data: HeatmapCardType[]) => void
) =>
	fetch(API_SCORES([...args]), {
		method: "GET",
	})
		.then((resp) => resp.json())
		.then((resp) => callBack(resp as HeatmapCardType[]))
		.catch((_) => browserHistory.push(ROUTES.Error.push()));

export const requestExp = (
	listGene: string[],
	tumorType: string,
	callBack: (data: DeconvDataType[]) => void
) =>
	fetch(
		API_URL +
			"/v1/deconv?genes=" +
			listGene.join(",") +
			"&tumortype=" +
			tumorType,
		{
			method: "GET",
		}
	)
		.then((resp) => resp.json())
		.then((resp) => callBack(resp as DeconvDataType[]))
		.catch((_) => browserHistory.push(ROUTES.Error.push()));
