import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { heatmapProps } from "../plots/plotsConfig.json";

interface Props {
	data: { tumorType: string; [key: string]: string }[];
	pairKeys: string[];
	tumorKeys: string[];
	heatmapOptions?: {
		[key: string]: any;
	};
	onHeatMapClick: (yKey: string) => void;
}

export const PlotHeatMap = (props: Props) => (
	// @ts-ignore
	<ResponsiveHeatMap
		data={props.data.filter((prop) =>
			props.tumorKeys.includes(prop.tumorType)
		)}
		keys={props.pairKeys}
		onClick={(e) => props.onHeatMapClick(e.yKey as string)}
		{...{ ...heatmapProps, ...props.heatmapOptions }}
	/>
);
