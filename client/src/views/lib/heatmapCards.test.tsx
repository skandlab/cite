import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";
import { render, cleanup } from "@testing-library/react";
import { HeatMapCards } from "./heatmapCards";
import { InterfaceScores } from "../../utils/interfaces";

const scoreData = [
	{ tumorType: "BRCA", cc: "1.08", cs: "0.22", nn: "8.33" },
	{ tumorType: "CRC", cc: "1.08", cs: "0.22", nn: "8.33" },
	{ tumorType: "LUAD", cc: "1.08", cs: "0.22", nn: "8.33" },
	{ tumorType: "SKCM", cc: "1.08", cs: "0.22", nn: "8.33" },
];

const data: InterfaceScores[] = [
	{ ligand: "BCAM", receptor: "NOX1", scoreMatrix: scoreData },
	{ ligand: "EGFR", receptor: "NOX1", scoreMatrix: scoreData },
	{ ligand: "BCAM", receptor: "KRAS", scoreMatrix: scoreData },
	{ ligand: "EGFR", receptor: "KRAS", scoreMatrix: scoreData },
];

const defaultRender = (
	xAxisFilterKeys = ["cc", "cs", "nn"],
	yAxisFilterKeys = ["BRCA", "CRC", "LUAD", "SKCM"]
) =>
	render(
		<HeatMapCards
			xAxisFilterKeys={xAxisFilterKeys}
			yAxisFilterKeys={yAxisFilterKeys}
			data={data}
		/>
	);

const datalessRender = (
	xAxisFilterKeys = ["cc", "cs", "nn"],
	yAxisFilterKeys = ["BRCA", "CRC", "LUAD", "SKCM"]
) =>
	render(
		<HeatMapCards
			xAxisFilterKeys={xAxisFilterKeys}
			yAxisFilterKeys={yAxisFilterKeys}
			data={[]}
		/>
	);

afterEach(() => {
	cleanup();
});

/**
 * cant render svgs
 * https://github.com/jsdom/jsdom/issues/300
 */
describe("render tests", () => {
	test("with data", () => {
		const { asFragment } = defaultRender();
		expect(asFragment()).toMatchSnapshot();
	});

	test("without data", () => {
		const { asFragment } = datalessRender();
		expect(asFragment()).toMatchSnapshot();

		screen.getByText("No Ligand-Receptor combination found.");
	});
});
