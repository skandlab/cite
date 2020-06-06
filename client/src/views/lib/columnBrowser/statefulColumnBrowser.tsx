import React, { useReducer, useEffect } from "react";
import { SemanticShorthandContent } from "semantic-ui-react";
import { BaseColumnBrowser, ColumnBrowserType } from "./baseColumnBrowser";

interface ColumnBrowserProps {
	title: string;
	options: ColumnBrowserType[];
	popupContent: SemanticShorthandContent;
	handleToggleCheckbox: (changedOptions: ColumnBrowserType[]) => void;
}

interface State {
	options: ColumnBrowserType[];
	totalChecked: number;
}

const initialState: State = {
	options: [],
	totalChecked: 0,
};

function reducer(
	state: State,
	action: {
		type: string;
		payload: any;
	}
) {
	switch (action.type) {
		case "UPDATE_INTIAL_OPTIONS":
			return {
				...state,
				options: action.payload as ColumnBrowserType[],
				totalChecked: (action.payload as ColumnBrowserType[]).filter(
					(option) => option.isChecked
				).length,
			};
		case "RESET_STATE":
			let resetStateOptions = (action.payload
				.options as ColumnBrowserType[])
				.map((option) => ({ ...option, isChecked: false }))
				.sort((a, b) => a.index - b.index);
			action.payload.handleToggleCheckbox(resetStateOptions.slice(0, 0));
			return {
				...initialState,
				options: resetStateOptions,
				totalChecked: 0,
			};
		case "TOGGLE_CHECKBOX":
			let { option, index, handleToggleCheckbox } = action.payload;
			let tmpOptions = [];
			let totalChecked = 0;

			if (option.isChecked) {
				let futureTotalChecked = state.totalChecked - 1;
				tmpOptions = [
					...state.options.slice(0, index),
					...state.options.slice(index + 1),
					{ ...state.options[index], isChecked: false },
				];
				tmpOptions = [
					...tmpOptions.slice(0, futureTotalChecked),
					...tmpOptions
						.slice(futureTotalChecked)
						.sort((a, b) => a.index - b.index),
				];
				totalChecked = futureTotalChecked;
			} else {
				tmpOptions = [
					{ ...state.options[index], isChecked: true },
					...state.options.slice(0, index),
					...state.options.slice(index + 1),
				];
				totalChecked = state.totalChecked + 1;
			}
			handleToggleCheckbox(tmpOptions.slice(0, totalChecked));
			return {
				...state,
				options: tmpOptions,
				totalChecked: totalChecked,
			};
		default:
			return state;
	}
}

export const StatefulColumnBrowser = (props: ColumnBrowserProps) => {
	const { options, handleToggleCheckbox } = props;
	const [state, dispatch] = useReducer(reducer, initialState);

	useEffect(
		() => dispatch({ type: "UPDATE_INTIAL_OPTIONS", payload: options }),
		[options]
	);

	return (
		<BaseColumnBrowser
			{...props}
			{...state}
			handleToggleCheckbox={(option, index) =>
				dispatch({
					type: "TOGGLE_CHECKBOX",
					payload: {
						option: option,
						index: index,
						handleToggleCheckbox: handleToggleCheckbox,
					},
				})
			}
			handleReset={() =>
				dispatch({
					type: "RESET_STATE",
					payload: {
						options: options,
						handleToggleCheckbox: handleToggleCheckbox,
					},
				})
			}
		/>
	);
};
