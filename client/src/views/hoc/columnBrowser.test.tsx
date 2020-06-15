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
		description: "cancer-cancer",
	},
	{
		index: 1,
		value: "cs",
		mute: false,
		isChecked: false,
		description: "cancer-stroma",
	},
	{
		index: 2,
		value: "nn",
		mute: false,
		isChecked: false,
		description: "normal-normal",
	},
	{
		index: 3,
		value: "sc",
		mute: false,
		isChecked: false,
		description: "stroma-stroma",
	},
];

const itemIsPresent = {
	cc: false,
	cs: false,
	nn: false,
	sc: false,
};

/**
 * nothing is selected
 */
const NoCheckedRender = () =>
	render(
		<ColumnBrowser
			filterIndex={0}
			title="Interaction type"
			popupContent={
				<p>if no associated heatmap present then gene will be dimmed</p>
			}
			options={options}
			itemIsPresent={itemIsPresent}
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
			filterIndex={0}
			title="Interaction type"
			popupContent={
				<p>if no associated heatmap present then gene will be dimmed</p>
			}
			options={[
				{ ...options[3], isChecked: true },
				...options.slice(0, 3),
			]}
			itemIsPresent={{
				sc: false,
				cc: true,
				cs: true,
				nn: true,
			}}
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
				{ item: "cc", checked: false, muted: false },
				{ item: "cs", checked: false, muted: false },
				{ item: "nn", checked: false, muted: false },
				{ item: "sc", checked: false, muted: false },
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
				{ item: "sc", checked: true, muted: false },
				{ item: "cc", checked: false, muted: true },
				{ item: "cs", checked: false, muted: true },
				{ item: "nn", checked: false, muted: true },
			],
			"1 / 4",
			false
		);
	});

	test("loading", () => {
		const { asFragment } = render(
			<ColumnBrowser
				filterIndex={0}
				title="Interaction type"
				popupContent={
					<p>
						if no associated heatmap present then gene will be
						dimmed
					</p>
				}
				options={options}
				itemIsPresent={itemIsPresent}
				loading={true}
				filteredOptions={[]}
				handleToggleCheckbox={mockedHandleToggleCheckbox}
				handleReset={mockedHandleReset}
			/>
		);

		expect(screen.getByRole("img"));
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
		TestState(
			"n",
			[{ item: "nn", checked: false, muted: true }],
			"1 / 4",
			false
		);

		fireEvent.change(getFilterInput(), { target: { value: "s" } });
		TestState(
			"s",
			[{ item: "sc", checked: true, muted: false }],
			"1 / 4",
			false
		);

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
				{ item: "cc", checked: false, muted: true },
				{ item: "cs", checked: false, muted: true },
				{ item: "nn", checked: false, muted: true },
				{ item: "sc", checked: true, muted: false },
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
				{ item: "cc", checked: false, muted: false },
				{ item: "cs", checked: false, muted: false },
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
				{ item: "cc", checked: false, muted: false },
				{ item: "cs", checked: false, muted: false },
				{ item: "nn", checked: false, muted: false },
				{ item: "sc", checked: false, muted: false },
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
	checkboxList: { item: string; checked: boolean; muted: boolean }[],
	statistic: string,
	disabled: boolean
) {
	expect(getFilterInput()).toHaveValue(filterValue);
	checkboxList.forEach(({ item, checked, muted }) => {
		checked
			? expect(getCheckbox(item)).toHaveClass("ui checked checkbox")
			: expect(getCheckbox(item)).not.toHaveClass("ui checked checkbox");

		if (muted) {
			expect(
				getCheckbox(item).getElementsByTagName("label")[0]
			).toHaveStyle(`color: #b3b3b3`);
			expect(
				getCheckbox(item).getElementsByTagName("small")[0]
			).toHaveStyle(`color: #b3b3b3`);
		} else {
			expect(
				getCheckbox(item).getElementsByTagName("label")[0]
			).toHaveStyle(`color: #4a4f59`);
			expect(
				getCheckbox(item).getElementsByTagName("small")[0]
			).toHaveStyle(`color: #4a4f59`);
		}
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
