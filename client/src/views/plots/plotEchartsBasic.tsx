import styled from "@emotion/styled";
import ReactEcharts from "echarts-for-react";
import {
	echartsProps as echartsPropsJson,
	barplotProps as barplotPropsJson,
	scatterplotProps as scatterplotPropsJson,
	lineplotProps as lineplotPropsJson,
} from "./__plotConfig__.json";

export const PlotEchartsBasic = styled(ReactEcharts)`
	height: 400px !important;
	max-width: 600px;
	min-width: 400px;
	margin: auto;
`;

export const echartsProps = {
	...echartsPropsJson,
	yAxis: {
		...echartsPropsJson.yAxis,
		axisLabel: {
			...echartsPropsJson.yAxis.axisLabel,
			formatter: function (value: string) {
				return Number(value).toFixed(2).toString();
			},
		},
	},
};

export const barplotProps = barplotPropsJson;
export const scatterplotProps = scatterplotPropsJson;
export const lineplotProps = lineplotPropsJson;
