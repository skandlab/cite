import React from "react";
import { HeatMap } from "../../../plots/heatmap";

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

export const ColorBar = () => (
	<div style={{ height: "64px", width: "360px" }}>
		<HeatMap
			data={data as any}
			pairKeys={[
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
			tumorKeys={["colorbar"]}
			heatmapOptions={{
				forceSquare: true,
				isInteractive: false,
				margin: { top: 0, right: 0, bottom: 24, left: 0 },
				axisTop: null,
				axisBottom: {
					tickSize: 3,
					tickPadding: 3,
					tickRotation: 0,
				},
			}}
		/>
	</div>
);
