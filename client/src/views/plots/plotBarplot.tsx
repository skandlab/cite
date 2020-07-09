import React from "react";
import { echartsProps, barplotProps } from "./plotEchartsBasic";
import { PlotEchartsBasic } from "./plotEchartsBasic";

interface Props {
	title?: string;
	xAxisName: string;
	yAxisName: string;
	barplotData: {
		name: string;
		value: number;
	}[];
}

const mergeProps = (props: Props) => {
	return {
		...echartsProps,
		xAxis: {
			...echartsProps.xAxis,
			type: "category",
			data: props.barplotData.map((d) => d.name),
			name: props.xAxisName,
			splitLine: {
				show: false,
			},
		},
		yAxis: {
			...echartsProps.yAxis,
			name: props.yAxisName,
		},
		series: {
			...barplotProps.series,
			data: props.barplotData,
			tooltip: {
				formatter: function (params: any) {
					return params.name + "<br/>expression: " + params.value;
				},
			},
		},
	};
};

export const PlotBar = (props: Props) => (
	<PlotEchartsBasic option={mergeProps(props)} />
);
