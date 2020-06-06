import React from "react";
import { SemanticShorthandContent } from "semantic-ui-react";
import { BaseColumnBrowser, ColumnBrowserType } from "./baseColumnBrowser";

interface ColumnBrowserProps {
	title: string;
	options: ColumnBrowserType[];
	popupContent: SemanticShorthandContent;
	handleToggleCheckbox: (changedOptions: ColumnBrowserType[]) => void;
}

export const StatelessColumnBrowser = (props: ColumnBrowserProps) => {
	const handleToggleCheckbox = (option: ColumnBrowserType, index: number) => {
		let filteredOptionList = [];
		if (option.isChecked) {
			filteredOptionList = [
				...props.options.slice(0, index),
				...props.options.slice(index + 1, totalChecked),
			];
		} else {
			filteredOptionList = props.options.slice(0, totalChecked);
			filteredOptionList.push({ ...option, isChecked: true });
		}
		props.handleToggleCheckbox(filteredOptionList);
	};

	let totalChecked = props.options.filter((option) => option.isChecked)
		.length;

	return (
		<BaseColumnBrowser
			{...props}
			totalChecked={totalChecked}
			handleToggleCheckbox={handleToggleCheckbox}
			handleReset={() => props.handleToggleCheckbox([])}
		/>
	);
};
