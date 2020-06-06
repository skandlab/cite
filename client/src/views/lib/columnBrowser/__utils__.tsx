import { screen } from "@testing-library/dom";

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
	return screen.getByTestId("filterInput").getElementsByTagName("input")[0];
}

export function getCheckboxListChilds() {
	return screen.getByTestId("checkbox-list").childNodes;
}

export function getCheckboxToggle(item: string) {
	return getCheckbox(item).getElementsByTagName("input")[0];
}

export function getCheckbox(item: string) {
	return screen.getByTestId(item);
}

export function getResetButton() {
	return screen.getByTestId("resetButton");
}

export function getStatistic() {
	return screen.getByTestId("statistic");
}
