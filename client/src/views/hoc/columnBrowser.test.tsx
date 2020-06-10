import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { ColumnBrowser } from "./columnBrowser";

const mockedHandleToggleCheckbox = jest.fn((data) => null);
const mockedHandleReset = jest.fn((data) => null);

const options = [
	{
		index: 0,
		value: "cc",
		mute: false,
		isChecked: false,
	},
	{
		index: 1,
		value: "cs",
		mute: false,
		isChecked: false,
	},
	{
		index: 2,
		value: "nn",
		mute: false,
		isChecked: false,
	},
	{
		index: 3,
		value: "sc",
		mute: false,
		isChecked: false,
	},
];

/**
 * nothing is selected
 */
const NoCheckedRender = () =>
	render(
		<ColumnBrowser
			index={0}
			title="Interaction type"
			popupContent={
				<p>if no associated heatmap present then gene will be dimmed</p>
			}
			options={options}
			loading={false}
			filteredOptions={[]}
			handleToggleCheckbox={mockedHandleToggleCheckbox}
			handleReset={mockedHandleReset}
		/>
	);

/**
 * one item is checked
 */
const OneCheckedRender = () =>
	render(
		<ColumnBrowser
			index={0}
			title="Interaction type"
			popupContent={
				<p>if no associated heatmap present then gene will be dimmed</p>
			}
			options={[
				...options.slice(0, 3),
				{ ...options[3], isChecked: true },
			]}
			loading={false}
			filteredOptions={[{ ...options[3], isChecked: true }]}
			handleToggleCheckbox={mockedHandleToggleCheckbox}
			handleReset={mockedHandleReset}
		/>
	);

afterEach(() => {
	cleanup();
	mockedHandleToggleCheckbox.mockClear();
	mockedHandleReset.mockClear();
});

describe("snapshot testing", () => {
	test("initial render", () => {
		const { asFragment } = NoCheckedRender();
		expect(asFragment()).toMatchSnapshot();

		TestState(
			"",
			[
				{ item: "cc", checked: false },
				{ item: "cs", checked: false },
				{ item: "nn", checked: false },
				{ item: "sc", checked: false },
			],
			"0 / 4",
			true
		);
	});

	test("one item is checked", () => {
		const { asFragment } = OneCheckedRender();
		expect(asFragment()).toMatchSnapshot();

		TestState(
			"",
			[
				{ item: "sc", checked: true },
				{ item: "cc", checked: false },
				{ item: "cs", checked: false },
				{ item: "nn", checked: false },
			],
			"1 / 4",
			false
		);
	});
});

describe("test method calls", () => {
	test("toggle", () => {
		NoCheckedRender();

		/**
		 * toggle nn
		 */
		fireEvent.click(getCheckboxToggle("nn"));
		expect(mockedHandleToggleCheckbox.mock.calls[0]).toEqual([
			0,
			{ ...options[2], isChecked: true },
			2,
		]);
	});

	test("untoggle", () => {
		OneCheckedRender();

		/**
		 * toggle sc
		 */
		fireEvent.click(getCheckboxToggle("sc"));
		expect(mockedHandleToggleCheckbox.mock.calls[0]).toEqual([
			0,
			{ ...options[3], isChecked: false },
			0,
		]);
	});

	test("reset", () => {
		OneCheckedRender();

		/**
		 * reset
		 */
		fireEvent.click(getResetButton());
		expect(mockedHandleReset.mock.calls[0][0]).toEqual(0);
	});
});

describe("test filter input", () => {
	test("filter n -> filter c -> reset", () => {
		OneCheckedRender();

		/**
		 * filter "n"
		 */
		fireEvent.change(getFilterInput(), { target: { value: "n" } });
		TestState("n", [{ item: "nn", checked: false }], "1 / 4", false);

		fireEvent.change(getFilterInput(), { target: { value: "s" } });
		TestState("s", [{ item: "sc", checked: true }], "1 / 4", false);

		/**
		 * reset,
		 * untoggling does not take place
		 * but check that input field is cleared
		 */
		fireEvent.click(getResetButton());
		expect(mockedHandleReset.mock.calls[0][0]).toEqual(0);
		TestState(
			"",
			[
				{ item: "cc", checked: false },
				{ item: "cs", checked: false },
				{ item: "nn", checked: false },
				{ item: "sc", checked: true },
			],
			"1 / 4",
			false
		);
	});

	test("filter -> clear", () => {
		NoCheckedRender();

		/**
		 * input change
		 */
		fireEvent.change(getFilterInput(), { target: { value: "c" } });
		TestState(
			"c",
			[
				{ item: "cc", checked: false },
				{ item: "cs", checked: false },
			],
			"0 / 4",
			true
		);

		/**
		 * clear input
		 */
		fireEvent.change(getFilterInput(), { target: { value: "" } });
		TestState(
			"",
			[
				{ item: "cc", checked: false },
				{ item: "cs", checked: false },
				{ item: "nn", checked: false },
				{ item: "sc", checked: false },
			],
			"0 / 4",
			true
		);
	});
});

/**
 * test ignored because disabled button is registering clicks
 * see the following links:
 *  https://github.com/testing-library/dom-testing-library/issues/92
 *  https://github.com/whatwg/html/issues/2368
 */
// test("filter -> reset", () => {});

/**
 * utils
 */
export function TestState(
	filterValue: string,
	checkboxList: { item: string; checked: boolean }[],
	statistic: string,
	disabled: boolean
) {
	expect(getFilterInput()).toHaveValue(filterValue);
	checkboxList.forEach(({ item, checked }) => {
		checked
			? expect(getCheckbox(item)).toHaveClass("ui checked checkbox")
			: expect(getCheckbox(item)).not.toHaveClass("ui checked checkbox");
	});
	expect(getCheckboxListChilds()).toHaveLength(checkboxList.length);
	expect(getStatistic()).toHaveTextContent(statistic);
	disabled
		? expect(getResetButton()).toBeDisabled()
		: expect(getResetButton()).not.toBeDisabled();
}

export function getFilterInput() {
	return screen.getByTestId("0_filterInput").getElementsByTagName("input")[0];
}

export function getCheckboxListChilds() {
	return screen.getByTestId("0_checkbox-list").childNodes;
}

export function getCheckboxToggle(item: string) {
	return getCheckbox(item).getElementsByTagName("input")[0];
}

export function getCheckbox(item: string) {
	return screen.getByTestId(item);
}

export function getResetButton() {
	return screen.getByTestId("0_resetButton");
}

export function getStatistic() {
	return screen.getByTestId("0_statistic");
}
