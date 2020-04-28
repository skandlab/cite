import React from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { heatmapProps } from "../plots/plots.json";

interface Props {
	data: { tumorType: string; [key: string]: string }[];
	pairKeys: string[];
	tumorKeys: string[];
	heatmapOptions?: {
		[key: string]: any;
	};
}

export const HeatMap = (props: Props) => (
	// @ts-ignore
	<ResponsiveHeatMap
		data={props.data.filter((prop) =>
			props.tumorKeys.includes(prop.tumorType)
		)}
		keys={props.pairKeys}
		{...{ ...heatmapProps, ...props.heatmapOptions }}
	/>
);
