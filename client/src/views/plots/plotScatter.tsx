import React from "react";
import {
	PlotEchartsBasic,
	echartsProps,
	scatterplotProps,
	lineplotProps,
} from "./plotEchartsBasic";

interface Props {
	title?: string;
	xAxisName: string;
	yAxisName: string;
	scatterplotData: {
		name: string;
		value: [number, number];
	}[];
	lineplotData: {
		name: string;
		value: [number, number];
	}[];
}

const mergeProps = (props: Props) => {
	return {
		...echartsProps,
		xAxis: {
			...echartsProps.xAxis,
			name: props.xAxisName,
		},
		yAxis: {
			...echartsProps.yAxis,
			name: props.yAxisName,
		},
		series: [
			{
				...scatterplotProps.series,
				data: props.scatterplotData,
				tooltip: {
					formatter: function (params: any) {
						return (
							params.name +
							"<br/>purity: " +
							params.value[0] +
							"<br/>expression: " +
							params.value[1]
						);
					},
				},
			},
			{
				...lineplotProps.series,
				data: props.lineplotData,
				tooltip: {
					formatter: function (params: any) {
						return (
							params.name +
							"<br/>purity: " +
							params.value[0] +
							"<br/>expression: " +
							params.value[1]
						);
					},
				},
			},
		],
	};
};

export const PlotScatter = (props: Props) => (
	<PlotEchartsBasic option={mergeProps(props)} />
);
