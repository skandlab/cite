import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomePage } from "./pageHome";
import OptionsPerCard from "../../../__mockEndpoints__";

const defaultRender = async () => {
	const { asFragment } = render(<HomePage />);
	await screen.findByText("cs");
	return asFragment;
};

jest.mock("../../../utils/constants", () => ({
	get ExampleQueryParams() {
		return ["A2M", "ACKR4", "GBM", "CRC"];
	},
}));

describe("snapshot tests", () => {
	test("nothing checked", async () => {
		const asFragment = await defaultRender();
		expect(asFragment()).toMatchSnapshot();

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);
	});

	test("one per group is checked", async () => {
		const asFragment = await defaultRender();
		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("CESC").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("3_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs", "CESC"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "1 / 6"],
			[true, true, false, false]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("ADAM15").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("0_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["ADAM15", "cs", "CESC"],
			["A2M", "AANAT", "ADAM12", "ADAM17"],
			["1 / 5", "0 / 5", "1 / 5", "1 / 6"],
			[false, true, false, false],
			5
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("ACKR4").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("1_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["ADAM15", "ACKR4", "cs", "CESC"],
			[
				"A2M",
				"AANAT",
				"ADAM12",
				"ADAM17",
				"ACKR2",
				"ACKR3",
				"ACVR1",
				"ACVR1B",
			],
			["1 / 5", "1 / 5", "1 / 5", "1 / 6"],
			[false, false, false, false],
			1
		);

		expect(asFragment()).toMatchSnapshot();
	});
});

describe("toggling tests", () => {
	test("toggle -> untoggle", async () => {
		render(<HomePage />);
		await screen.findByText("cs");
		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.getByRole("img");
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * untoggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.getByRole("img");
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);
	});

	test("toggle -> reset", async () => {
		render(<HomePage />);
		await screen.findByText("cs");
		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * reset
		 */
		fireEvent.click(screen.getByTestId("2_resetButton"));
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);
	});

	test("filter -> toggle -> reset", async () => {
		render(<HomePage />);
		await screen.findByText("cs");
		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);

		/**
		 * filter "c"
		 */
		await userEvent.type(
			screen
				.getByTestId("2_filterInput")
				.getElementsByTagName("input")[0],
			"c"
		);
		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * reset
		 */
		fireEvent.click(screen.getByTestId("2_resetButton"));
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);
	});

	test("toggle -> toggle -> toggle -> filter -> untoggle -> clear -> reset", async () => {
		render(<HomePage />);
		await screen.findByText("cs");
		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("sc").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs", "sc"],
			[],
			["0 / 5", "0 / 5", "2 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("nn").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs", "sc", "nn"],
			[],
			["0 / 5", "0 / 5", "3 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * filter "c"
		 */
		await userEvent.type(
			screen
				.getByTestId("2_filterInput")
				.getElementsByTagName("input")[0],
			"c"
		);
		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "3 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * untoggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			[],
			[],
			["0 / 5", "0 / 5", "2 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * filter clear
		 */
		await userEvent.clear(
			screen.getByTestId("2_filterInput").getElementsByTagName("input")[0]
		);
		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["sc", "nn"],
			[],
			["0 / 5", "0 / 5", "2 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * reset
		 */
		fireEvent.click(screen.getByTestId("2_resetButton"));
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);
	});

	test("example", async () => {
		render(<HomePage />);
		await screen.findByText("cs");

		fireEvent.click(screen.getByTestId("exampleButton"));
		await screen.getAllByRole("img");
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["A2M", "ACKR4", "GBM", "CRC"],
			[
				"AANAT",
				"ADAM12",
				"ADAM15",
				"ADAM17",
				"ACKR2",
				"ACKR3",
				"ACVR1",
				"ACVR1B",
			],
			["1 / 5", "1 / 5", "0 / 5", "2 / 6"],
			[false, false, true, false],
			1
		);
	});
});

describe("integration tests", () => {
	test("useflow: t3,t4,t1,t2,ut4,ut2,ut1,ut3", async () => {
		render(<HomePage />);
		await screen.findByText("cs");
		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("CESC").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("3_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs", "CESC"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "1 / 6"],
			[true, true, false, false]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("ADAM15").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("0_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["ADAM15", "cs", "CESC"],
			["A2M", "AANAT", "ADAM12", "ADAM17"],
			["1 / 5", "0 / 5", "1 / 5", "1 / 6"],
			[false, true, false, false],
			5
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("ACKR4").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("1_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["ADAM15", "ACKR4", "cs", "CESC"],
			[
				"A2M",
				"AANAT",
				"ADAM12",
				"ADAM17",
				"ACKR2",
				"ACKR3",
				"ACVR1",
				"ACVR1B",
			],
			["1 / 5", "1 / 5", "1 / 5", "1 / 6"],
			[false, false, false, false],
			1
		);

		/**
		 * untoggle
		 */
		fireEvent.click(
			screen.getByTestId("CESC").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("3_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["ADAM15", "ACKR4", "cs"],
			[
				"A2M",
				"AANAT",
				"ADAM12",
				"ADAM17",
				"ACKR2",
				"ACKR3",
				"ACVR1",
				"ACVR1B",
			],
			["1 / 5", "1 / 5", "1 / 5", "0 / 6"],
			[false, false, false, true],
			1
		);

		/**
		 * untoggle
		 */
		fireEvent.click(
			screen.getByTestId("ACKR4").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("1_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["ADAM15", "cs"],
			["A2M", "AANAT", "ADAM12", "ADAM17"],
			["1 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[false, true, false, true],
			5
		);

		/**
		 * untoggle
		 */
		fireEvent.click(
			screen.getByTestId("ADAM15").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("0_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * untoggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);
	});

	test("useflow: t3,t4,t1,t2,filter2,t2,ut1,reset2,ut3,reset4", async () => {
		render(<HomePage />);
		await screen.findByText("cs");
		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "0 / 6"],
			[true, true, false, true]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("CESC").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("3_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["cs", "CESC"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "1 / 6"],
			[true, true, false, false]
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("ADAM15").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("0_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["ADAM15", "cs", "CESC"],
			["A2M", "AANAT", "ADAM12", "ADAM17"],
			["1 / 5", "0 / 5", "1 / 5", "1 / 6"],
			[false, true, false, false],
			5
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("ACKR4").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("1_checkbox-list");

		TestState(
			[5, 5, 5, 6],
			["", "", "", ""],
			["ADAM15", "ACKR4", "cs", "CESC"],
			[
				"A2M",
				"AANAT",
				"ADAM12",
				"ADAM17",
				"ACKR2",
				"ACKR3",
				"ACVR1",
				"ACVR1B",
			],
			["1 / 5", "1 / 5", "1 / 5", "1 / 6"],
			[false, false, false, false],
			1
		);

		/**
		 * filter "c"
		 */
		await userEvent.type(
			screen
				.getByTestId("2_filterInput")
				.getElementsByTagName("input")[0],
			"c"
		);
		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			["ADAM15", "ACKR4", "cs", "CESC"],
			[
				"A2M",
				"AANAT",
				"ADAM12",
				"ADAM17",
				"ACKR2",
				"ACKR3",
				"ACVR1",
				"ACVR1B",
			],
			["1 / 5", "1 / 5", "1 / 5", "1 / 6"],
			[false, false, false, false],
			1
		);

		/**
		 * toggle
		 */
		fireEvent.click(
			screen.getByTestId("ACVR1B").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("1_checkbox-list");

		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			["ADAM15", "ACKR4", "ACVR1B", "cs", "CESC"],
			["A2M", "AANAT", "ADAM12", "ADAM17", "ACKR2", "ACKR3", "ACVR1"],
			["1 / 5", "2 / 5", "1 / 5", "1 / 6"],
			[false, false, false, false],
			2
		);

		/**
		 * untoggle
		 */
		fireEvent.click(
			screen.getByTestId("ADAM15").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("0_checkbox-list");

		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			["ACKR4", "ACVR1B", "cs", "CESC"],
			["ACKR2", "ACKR3", "ACVR1"],
			["0 / 5", "2 / 5", "1 / 5", "1 / 6"],
			[true, false, false, false],
			10
		);

		/**
		 * reset
		 */
		fireEvent.click(screen.getByTestId("1_resetButton"));
		await screen.findByTestId("1_checkbox-list");

		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			["cs", "CESC"],
			[],
			["0 / 5", "0 / 5", "1 / 5", "1 / 6"],
			[true, true, false, false]
		);

		/**
		 * untoggle
		 */
		fireEvent.click(
			screen.getByTestId("cs").getElementsByTagName("input")[0]
		);
		await screen.findByTestId("2_checkbox-list");

		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			["CESC"],
			[],
			["0 / 5", "0 / 5", "0 / 5", "1 / 6"],
			[true, true, true, false]
		);

		/**
		 * reset
		 */
		fireEvent.click(screen.getByTestId("3_resetButton"));
		await screen.findByTestId("3_checkbox-list");

		TestState(
			[5, 5, 2, 6],
			["", "", "c", ""],
			[],
			[],
			["0 / 5", "0 / 5", "0 / 5", "0 / 6"],
			[true, true, true, true]
		);
	});
});

function TestState(
	itemLengths: number[],
	filterValues: string[],
	checkedItems: string[],
	mutedItems: string[],
	statisticValues: string[],
	resetValues: boolean[],
	expectedDataLength: number = itemLengths[0] * itemLengths[1]
) {
	// number of cards
	expect(screen.getAllByTestId(/filterInput/)).toHaveLength(4);

	// filter value for each card
	screen.getAllByTestId(/filterInput/).forEach((item, index) => {
		expect(item.getElementsByTagName("input")[0]).toHaveValue(
			filterValues[index]
		);
	});

	// no. of items per cards
	itemLengths.forEach((itemLength, index) => {
		expect(
			screen.getByTestId(index + "_checkbox-list").childNodes
		).toHaveLength(itemLength);
	});

	// which items are checked
	(OptionsPerCard as string[][]).forEach((itemsPerCard, index) => {
		let count = 0;
		itemsPerCard.forEach((item) => {
			if (checkedItems.includes(item)) {
				expect(screen.getByTestId(item)).toHaveClass(
					"ui checked checkbox"
				);
				count++;
			} else {
				let el = screen.queryByTestId(item);
				if (el !== null) {
					count++;
					expect(el).not.toHaveClass("ui checked checkbox");
				}
			}
		});
		expect(count).toEqual(itemLengths[index]);
	});

	// wwhich items are muted
	(OptionsPerCard as string[][]).forEach((itemsPerCard, index) => {
		let count = 0;
		itemsPerCard.forEach((item) => {
			if (mutedItems.includes(item)) {
				expect(
					screen.getByTestId(item).getElementsByTagName("label")[0]
				).toHaveStyle(`color: #b3b3b3`);
				if (
					screen
						.getByTestId(item)
						.getElementsByTagName("small")[0] !== undefined
				) {
					expect(
						screen
							.getByTestId(item)
							.getElementsByTagName("small")[0]
					).toHaveStyle(`color: #b3b3b3`);
				}
				count++;
			} else {
				let el = screen.queryByTestId(item);
				if (el !== null) {
					count++;
					expect(el.getElementsByTagName("label")[0]).toHaveStyle(
						`color: #4a4f59`
					);
					// undefined for ligand and receptor
					if (el.getElementsByTagName("small")[0] !== undefined) {
						expect(el.getElementsByTagName("small")[0]).toHaveStyle(
							`color: #4a4f59`
						);
					}
				}
			}
		});
		expect(count).toEqual(itemLengths[index]);
	});

	// check values of statistic
	screen.getAllByTestId(/statistic/).forEach((item, index) => {
		expect(item).toHaveTextContent(statisticValues[index]);
	});

	// check state of reset button
	screen.getAllByTestId(/resetButton/).forEach((item, index) => {
		resetValues[index]
			? expect(item).toBeDisabled()
			: expect(item).not.toBeDisabled();
	});

	expect(screen.getAllByTestId("displayCard")).toHaveLength(
		Math.min(12, expectedDataLength)
	);
}
