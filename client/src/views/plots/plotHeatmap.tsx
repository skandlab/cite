import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { heatmapProps } from "../plots/plotsConfig.json";

interface Props {
	data: { tumorType: string; [key: string]: string }[];
	xAxisFilterKeys: string[];
	yAxisFilterKeys: string[];
	heatmapOptions?: {
		[key: string]: any;
	};
	onHeatMapClick: (yKey: string) => void;
}

export const PlotHeatMap = (props: Props) => (
	// @ts-ignore
	<ResponsiveHeatMap
		data={props.data.filter((prop) =>
			props.yAxisFilterKeys.includes(prop.tumorType)
		)}
		keys={props.xAxisFilterKeys}
		onClick={(e) => props.onHeatMapClick(e.yKey as string)}
		{...{ ...heatmapProps, ...props.heatmapOptions }}
	/>
);
