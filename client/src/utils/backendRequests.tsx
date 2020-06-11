import { browserHistory } from "./browserHistory";
import { ROUTES } from "./routes";

export const API_URL = "http://localhost:5000/server";

export type DeconvDataType = {
	gene: string;
	tumorType: string;
	scatterPlotData: {
		name: string;
		value: [number, number];
	}[];
	linePlotData: {
		name: string;
		value: [number, number];
	}[];
	barPlotData: {
		name: string;
		value: number;
	}[];
};

export const requestScores = (args: string[][]) =>
	fetch(
		API_URL +
			"/v1/scores?ligands=" +
			args[0].join(",") +
			"&receptors=" +
			args[1].join(",") +
			"&interactions=" +
			args[2].join(",") +
			"&tumors=" +
			args[3].join(","),
		{
			method: "GET",
		}
	);

export const requestCheckboxOptions = () =>
	fetch(API_URL + "/v1/options/checkbox", {
		method: "GET",
	});

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
