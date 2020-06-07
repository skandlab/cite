import React from "react";
import { PlotHeatMap } from "../../plots/plotHeatmap";
import styled from "@emotion/styled";

const data = [
	{
		tumorType: "colorbar",
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

const StyledColorBar = styled.div`
	height: 64px;
	width: 360px;
`;

export const ColorBar = () => (
	<StyledColorBar>
		<PlotHeatMap
			data={data as any}
			xAxisFilterKeys={[
				"10",
				"20",
				"30",
				"40",
				"50",
				"60",
				"70",
				"80",
				"90",
				"100",
			]}
			yAxisFilterKeys={["colorbar"]}
			heatmapOptions={{
				isInteractive: false,
				margin: { top: 0, right: 0, bottom: 40, left: 0 },
				axisTop: null,
				axisBottom: {
					tickSize: 3,
					tickPadding: 3,
					tickRotation: 0,
					legend: "Relative Crosstalk Score",
					legendPosition: "middle",
					legendOffset: 32,
				},
			}}
			onHeatMapClick={(_) => _}
		/>
	</StyledColorBar>
);
