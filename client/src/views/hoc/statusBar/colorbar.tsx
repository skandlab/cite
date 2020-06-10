import React from "react";
import styled from "@emotion/styled";
import { ResponsiveHeatMap, HeatMapSvgProps } from "@nivo/heatmap";
import { heatmapProps } from "../../plots/__plotConfig__.json";

const data = [
	{
		title: "colorbar",
		10: 10,
		20: 20,
		30: 30,
		40: 40,
		50: 50,
		60: 60,
		70: 70,
		80: 80,
		90: 90,
		100: 100,
	},
];

export const ColorBar = () => (
	<StyledColorBar>
		<ResponsiveHeatMap
			{...(heatmapProps as HeatMapSvgProps)}
			data={data}
			indexBy="title"
			keys={["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"]}
			isInteractive={false}
			margin={{ top: 0, right: 0, bottom: 40, left: 0 }}
			axisTop={null}
			axisBottom={{
				tickSize: 3,
				tickPadding: 3,
				tickRotation: 0,
				legend: "Relative Crosstalk Score",
				legendPosition: "middle",
				legendOffset: 32,
			}}
		/>
	</StyledColorBar>
);

const StyledColorBar = styled.div`
	height: 72px;
	width: 360px;
`;
