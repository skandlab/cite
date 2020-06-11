import { HeatMapDataType } from "../views/plots/plotHeatmap";

export type HeatmapCardType = {
	ligand: string;
	receptor: string;
	data: HeatMapDataType;
};
