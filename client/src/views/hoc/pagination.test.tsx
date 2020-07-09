import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { screen } from "@testing-library/dom";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { AppPagination, calculatePaginationItems } from "./pagination";

afterEach(() => {
	cleanup();
});

const mockedHandleOnPageChange = jest.fn((data) => null);

const defaultRender = (totalItems: number) =>
	render(
		<AppPagination
			currentPageNumber={1}
			totalItems={totalItems}
			handleOnPageChange={mockedHandleOnPageChange}
		/>
	);

describe("snapshot testing", () => {
	test("page 1", () => {
		defaultRender(10);
		expect(getTag_a()).toHaveLength(5);
		getTag_a_value(["1"]);
	});

	test("page 2", () => {
		defaultRender(20);
		expect(getTag_a()).toHaveLength(6);
		getTag_a_value(["1", "2"]);
	});

	test("page last", () => {
		defaultRender(113);
		expect(getTag_a()).toHaveLength(11);
		getTag_a_value(["1", "2", "3", "4", "5", "...", "10"]);
	});

	test("items 0 ", () => {
		defaultRender(0);
		expect(getTag_a()).toHaveLength(5);
		getTag_a_value(["1"]);
	});
});

/**
 * no need to check render,
 * as rendering is done by external library
 */
describe("change page number", () => {
	test("1 -> 2", () => {
		defaultRender(20);
		let aTags = getTag_a();

		fireEvent.click(aTags[3]);

		expect(mockedHandleOnPageChange.mock.calls[0][0]).toEqual(2);
		mockedHandleOnPageChange.mockClear();
	});

	test("2 -> 1", () => {
		defaultRender(20);
		let aTags = getTag_a();

		fireEvent.click(aTags[2]);

		/**
		 * already on page 1
		 */
		expect(mockedHandleOnPageChange.mock.calls[0]).toBeUndefined();

		fireEvent.click(aTags[3]);
		expect(mockedHandleOnPageChange.mock.calls[0][0]).toEqual(2);
		fireEvent.click(aTags[2]);

		// not called if page changed to same page
		expect(mockedHandleOnPageChange.mock.calls[1]).toBeUndefined();
		mockedHandleOnPageChange.mockClear();
	});
});

describe("calculate page items", () => {
	test("page 1", () => {
		expect(calculatePaginationItems(1)).toEqual({ start: 0, end: 12 });
	});

	test("page 2", () => {
		expect(calculatePaginationItems(2)).toEqual({ start: 12, end: 24 });
	});
});

function getTag_a() {
	return screen.getByRole("navigation").getElementsByTagName("a");
}

/**
 * after striping away the first and last two items
 * i.e the `<<` and `<`
 */
function getTag_a_value(expectedValues: string[]) {
	let items = Array.from(getTag_a());

	items.slice(2, -2).forEach((el, index) => {
		expect(el).toHaveTextContent(expectedValues[index]);
	});
}
