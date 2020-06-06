import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { StatefulColumnBrowser } from "./statefulColumnBrowser";
import {
	TestState,
	getFilterInput,
	getCheckboxToggle,
	getResetButton,
} from "./__utils__";

const mockedHandleToggleCheckbox = jest.fn((data) => null);

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
];

const InitialRender = () =>
	render(
		<StatefulColumnBrowser
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
		<StatefulColumnBrowser
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

test("toggle -> untoggle", () => {
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
	 * untoggle nn
	 */
	fireEvent.click(getCheckboxToggle("nn"));
	expect(mockedHandleToggleCheckbox.mock.calls[0][0]).toEqual([]);
	mockedHandleToggleCheckbox.mockClear();
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

test("toggle -> reset", () => {
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

test("toggle -> filter -> reset", () => {
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

test("filter -> toggle -> clear -> reset", () => {
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
	TestState(
		"c",
		[
			{ item: "cc", checked: true },
			{ item: "cs", checked: false },
		],
		"1 / 3",
		false
	);

	/**
	 * clear input
	 */
	fireEvent.change(getFilterInput(), { target: { value: "" } });
	TestState(
		"",
		[
			{ item: "cc", checked: true },
			{ item: "cs", checked: false },
			{ item: "nn", checked: false },
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

/**
 * test ignored because disabled button is registering clicks
 * see the following links:
 *  https://github.com/testing-library/dom-testing-library/issues/92
 *  https://github.com/whatwg/html/issues/2368
 */
// test("filter -> reset", () => {});
