import { HeatMapDataType } from "../views/plots/plotHeatmap";

export type HeatmapCardType = {
	ligand: string;
	receptor: string;
	data: HeatMapDataType;
};

export interface InterfaceExpressionEndpoint {
	gene: string;
	tumorType: string;
	scatterplot: {
		name: string;
		value: [number, number];
	}[];
	barplot: {
		name: string;
		value: number;
	}[];
	lineplot: {
		name: string;
		value: [number, number];
	}[];
}
