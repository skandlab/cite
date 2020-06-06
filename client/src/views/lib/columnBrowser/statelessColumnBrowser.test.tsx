import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { StatelessColumnBrowser } from "./statelessColumnBrowser";
import {
	TestState,
	getFilterInput,
	getCheckboxToggle,
	getResetButton,
} from "./__utils__";

const optionValueList = ["cc", "cs", "nn"];

const mockedHandleToggleCheckbox = jest.fn((data) => null);

const options = [
	{
		index: 0,
		value: optionValueList[0],
		mute: false,
		isChecked: false,
	},
	{
		index: 1,
		value: optionValueList[1],
		mute: false,
		isChecked: false,
	},
	{
		index: 2,
		value: optionValueList[2],
		mute: false,
		isChecked: false,
	},
];

const InitialRender = () =>
	render(
		<StatelessColumnBrowser
			title="Interaction type"
			options={options}
			popupContent={
				<p>if no associated heatmap present then gene will be dimmed</p>
			}
			handleToggleCheckbox={mockedHandleToggleCheckbox}
		/>
	);

const OneCheckedRender = () =>
	render(
		<StatelessColumnBrowser
			title="Interaction type"
			options={[
				{
					index: 0,
					mute: true,
					isChecked: false,
					value: "cc",
					description: "cancer-cancer",
				},
				{
					index: 1,
					mute: true,
					isChecked: false,
					value: "cs",
					description: "cancer-stroma",
				},
				{
					index: 2,
					mute: false,
					isChecked: true,
					value: "nn",
					description: "normal-normal",
				},
			]}
			popupContent={null}
			handleToggleCheckbox={mockedHandleToggleCheckbox}
		/>
	);

/**
 * checked items will always be on top
 */
const TwoCheckedRender = () =>
	render(
		<StatelessColumnBrowser
			title="Interaction type"
			options={[
				{
					index: 0,
					mute: false,
					isChecked: true,
					value: "cc",
				},
				{
					index: 2,
					mute: false,
					isChecked: true,
					value: "nn",
				},
				{
					index: 1,
					mute: true,
					isChecked: false,
					value: "cs",
				},
			]}
			popupContent={null}
			handleToggleCheckbox={mockedHandleToggleCheckbox}
		/>
	);

afterEach(() => {
	cleanup();
	mockedHandleToggleCheckbox.mockClear();
});

test("initial render", () => {
	const { asFragment } = InitialRender();
	expect(asFragment()).toMatchSnapshot();

	TestState(
		"",
		[
			{ item: "cc", checked: false },
			{ item: "cs", checked: false },
			{ item: "nn", checked: false },
		],
		"0 / 3",
		true
	);
});

test("one item is checked", () => {
	const { asFragment } = OneCheckedRender();
	expect(asFragment()).toMatchSnapshot();

	TestState(
		"",
		[
			{ item: "cc", checked: false },
			{ item: "cs", checked: false },
			{ item: "nn", checked: true },
		],
		"1 / 3",
		false
	);
});

test("toggle", () => {
	InitialRender();

	/**
	 * initial render
	 */
	TestState(
		"",
		[
			{ item: "cc", checked: false },
			{ item: "cs", checked: false },
			{ item: "nn", checked: false },
		],
		"0 / 3",
		true
	);

	/**
	 * toggle nn
	 */
	fireEvent.click(getCheckboxToggle("nn"));
	expect(mockedHandleToggleCheckbox.mock.calls[0][0]).toEqual([
		{ ...options[2], isChecked: true },
	]);
	mockedHandleToggleCheckbox.mockClear();
});

test("two item is checked -> untoggle", () => {
	TwoCheckedRender();

	/**
	 * initial render
	 */
	TestState(
		"",
		[
			{ item: "cc", checked: true },
			{ item: "cs", checked: false },
			{ item: "nn", checked: true },
		],
		"2 / 3",
		false
	);

	/**
	 * toggle nn
	 */
	fireEvent.click(getCheckboxToggle("nn"));
	expect(mockedHandleToggleCheckbox.mock.calls[0][0]).toEqual([
		{ ...options[0], isChecked: true },
	]);
	mockedHandleToggleCheckbox.mockClear();
});

test("one item is checked -> reset", () => {
	OneCheckedRender();

	/**
	 * initial render
	 */
	TestState(
		"",
		[
			{ item: "cc", checked: false },
			{ item: "cs", checked: false },
			{ item: "nn", checked: true },
		],
		"1 / 3",
		false
	);

	/**
	 * reset
	 */
	fireEvent.click(getResetButton());
	expect(mockedHandleToggleCheckbox.mock.calls[0][0]).toEqual([]);
	mockedHandleToggleCheckbox.mockClear();
});

test("one item is checked -> filter -> reset", () => {
	OneCheckedRender();

	/**
	 * initial render
	 */
	TestState(
		"",
		[
			{ item: "cc", checked: false },
			{ item: "cs", checked: false },
			{ item: "nn", checked: true },
		],
		"1 / 3",
		false
	);

	/**
	 * filter "n"
	 */
	fireEvent.change(getFilterInput(), { target: { value: "n" } });
	TestState("n", [{ item: "nn", checked: true }], "1 / 3", false);

	/**
	 * reset
	 */
	fireEvent.click(getResetButton());
	expect(mockedHandleToggleCheckbox.mock.calls[0][0]).toEqual([]);
	mockedHandleToggleCheckbox.mockClear();
});

test("filter -> toggle", () => {
	/**
	 * initial
	 */
	InitialRender();
	TestState(
		"",
		[
			{ item: "cc", checked: false },
			{ item: "cs", checked: false },
			{ item: "nn", checked: false },
		],
		"0 / 3",
		true
	);

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
		"0 / 3",
		true
	);

	/**
	 * toggle
	 */
	fireEvent.click(getCheckboxToggle("cc"));
	expect(mockedHandleToggleCheckbox.mock.calls[0][0]).toEqual([
		{ ...options[0], isChecked: true },
	]);
	mockedHandleToggleCheckbox.mockClear();
});
