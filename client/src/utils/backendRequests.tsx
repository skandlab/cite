import axios from "axios";
import { HeatMapDataType } from "../views/plots/plotHeatmap";
import { SemanticShorthandContent } from "semantic-ui-react/dist/commonjs/generic";
import { ColumnBrowserType } from "../views/hoc/columnBrowser";
import { browserHistory } from "./browserHistory";
import { ROUTES } from "./routes";

export const API_URL = "/server";

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
	axios
		.all([
			axios.request({
				method: "GET",
				url: API_CHECKBOX_OPTIONS(),
			}),
			axios.request({
				method: "GET",
				url: API_SCORES([[], [], [], []]),
			}),
		])
		.then((resp) =>
			callBack(
				resp[0].data as FilterMetadata[],
				resp[1].data as HeatmapCardType[]
			)
		)
		.catch((_) => browserHistory.push(ROUTES.Error.push()));

export const requestScores = (
	args: string[][],
	callBack: (data: HeatmapCardType[]) => void
) =>
	axios
		.request({
			method: "GET",
			url: API_SCORES([...args]),
		})
		.then((resp) => callBack(resp.data as HeatmapCardType[]))
		.catch((_) => browserHistory.push(ROUTES.Error.push()));

export const requestExp = (
	listGene: string[],
	tumorType: string,
	callBack: (data: DeconvDataType[]) => void
) =>
	axios
		.request({
			method: "GET",
			url:
				API_URL +
				"/v1/deconv?genes=" +
				listGene.join(",") +
				"&tumortype=" +
				tumorType,
		})
		.then((resp) => callBack(resp.data as DeconvDataType[]))
		.catch((_) => browserHistory.push(ROUTES.Error.push()));
