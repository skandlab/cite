import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";
import { render, cleanup } from "@testing-library/react";
import { Summary } from "./summary";

afterEach(() => {
	cleanup();
});

const defaultRender = (totalItems: number, currentPageNumber: number) =>
	render(
		<Summary
			totalItems={totalItems}
			currentPageNumber={currentPageNumber}
		/>
	);

describe("basic cases", () => {
	test("page 1", () => {
		defaultRender(10, 1);
		screen.getByText("1-10");
	});

	test("page 2", () => {
		defaultRender(20, 2);
		screen.getByText("13-20");
	});

	test("edge case", () => {
		defaultRender(13, 1);
		screen.getByText("1-12");
	});

	test("items 0 ", () => {
		defaultRender(0, 1);
		screen.getByText("0-0");
	});
});
