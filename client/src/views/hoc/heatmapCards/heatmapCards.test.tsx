import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";
import { render, cleanup } from "@testing-library/react";
import { HeatMapCardGroup } from "./heatmapCards";
import { HeatMapDataType } from "../../plots/plotHeatmap";

const scoreData = {
	xyValues: [
		{ tumorType: "BRCA", cc: "1.08", cs: "0.22", nn: "8.33" },
		{ tumorType: "CRC", cc: "1.08", cs: "0.22", nn: "8.33" },
		{ tumorType: "LUAD", cc: "1.08", cs: "0.22", nn: "8.33" },
		{ tumorType: "SKCM", cc: "1.08", cs: "0.22", nn: "8.33" },
	],
	keys: ["cc", "cs", "nn"],
	indexBy: "tumorType",
};

const data: {
	ligand: string;
	receptor: string;
	data: HeatMapDataType;
}[] = [
	{ ligand: "BCAM", receptor: "NOX1", data: scoreData },
	{ ligand: "EGFR", receptor: "NOX1", data: scoreData },
	{ ligand: "BCAM", receptor: "KRAS", data: scoreData },
	{ ligand: "EGFR", receptor: "KRAS", data: scoreData },
];

const defaultRender = () => render(<HeatMapCardGroup scoreDataList={data} />);

const datalessRender = () => render(<HeatMapCardGroup scoreDataList={[]} />);

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
