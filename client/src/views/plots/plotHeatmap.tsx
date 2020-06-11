import React from "react";
import { ResponsiveHeatMap, HeatMapSvgProps } from "@nivo/heatmap";
import { heatmapProps } from "../plots/__plotConfig__.json";

export type HeatMapDataType = {
	xyValues: { [key: string]: string }[];
	keys: string[];
	indexBy: string;
};

interface Props {
	data: HeatMapDataType;
	onHeatMapClick: (yKey: string) => void;
}

export const PlotHeatMap = ({ data, onHeatMapClick }: Props) => (
	<ResponsiveHeatMap
		{...(heatmapProps as HeatMapSvgProps)}
		data={data.xyValues}
		indexBy={data.indexBy}
		keys={data.keys}
		onClick={(e) => onHeatMapClick(e.yKey as string)}
	/>
);
