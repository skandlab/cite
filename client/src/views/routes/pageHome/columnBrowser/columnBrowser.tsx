import React, { useState, useEffect, useRef } from "react";
import {
	Item,
	Checkbox,
	Icon,
	Form,
	Card,
	Statistic,
	Button,
	Dimmer,
	Loader,
} from "semantic-ui-react";
import styled from "@emotion/styled";

import { InterfaceColumnBrowserProps } from "../../../../utils/interfaces";

interface InterfaceFilteredOptionsProps extends InterfaceColumnBrowserProps {
	orginalIndex: number;
}

interface Props {
	title: string;
	options: InterfaceColumnBrowserProps[];
	handleFilter: (options: InterfaceColumnBrowserProps[]) => void;
	isFetchingData: boolean;
}

const StyledItemGroup = styled(Item.Group)`
	overflow-y: scroll;
	height: 160px;
	min-height: 160px;
`;

const StyledItem = styled(Item)`
	margin-top: 0 !important;
`;

const CheckboxItem = (props: {
	index: number;
	option: InterfaceColumnBrowserProps;
	handleToggleCheckbox: Function;
}) => (
	<StyledItem
		key={props.option.value}
		meta={
			props.option.description && (
				<>
					<small>{props.option.description}</small>
					<br /> {/* TODO */}
				</>
			)
		}
		description={
			<Checkbox
				label={props.option.value}
				checked={props.option.isChecked}
				onChange={() =>
					props.handleToggleCheckbox(
						props.index,
						props.option.isChecked
					)
				}
			/>
		}
	/>
);

export const ColumnBrowser = (props: Props) => {
	const [options, updateOptions] = useState(props.options);
	const [filteredOptions, updateFilteredOptions] = useState<
		InterfaceFilteredOptionsProps[]
	>([]);
	const [inputText, updateInputText] = useState("");

	const isFirstRunOptions = useRef(true);
	const isFirstRunFilteredOptions = useRef(true);

	useEffect(() => {
		if (isFirstRunOptions.current) {
			isFirstRunOptions.current = false;
			return;
		}

		let tmp = props.options;
		filteredOptions.forEach(
			(option) => (tmp[option.orginalIndex].isChecked = true)
		);
		updateOptions(tmp);
	}, [props.options]);
	useEffect(() => {
		if (isFirstRunFilteredOptions.current) {
			isFirstRunFilteredOptions.current = false;
			return;
		}

		props.handleFilter(filteredOptions);
	}, [filteredOptions]);

	/*
	 * handle click on a checkbox
	 * empty array means `all`
	 */
	const handleToggleCheckbox = (index: number, prevChecked: boolean) => {
		if (!prevChecked) {
			updateFilteredOptions([
				...filteredOptions,
				{
					...options[index],
					isChecked: !prevChecked,
					orginalIndex: index,
				},
			]);
			updateOptions([
				...options.slice(0, index),
				{ ...options[index], isChecked: !prevChecked },
				...options.slice(index + 1, options.length),
			]);
		} else {
			updateFilteredOptions([
				...filteredOptions.slice(0, index),
				...filteredOptions.slice(index + 1, filteredOptions.length),
			]);
			updateOptions([
				...options.slice(0, filteredOptions[index].orginalIndex),
				{
					...options[filteredOptions[index].orginalIndex],
					isChecked: !prevChecked,
				},
				...options.slice(
					filteredOptions[index].orginalIndex + 1,
					options.length
				),
			]);
		}
	};

	return (
		<Card>
			<Card.Content>
				<Card.Meta>
					<Icon name="filter" /> {props.title}
				</Card.Meta>
				<Card.Description>
					<Form>
						<Form.Group widths="equal">
							<Form.Input
								icon="search"
								iconPosition="left"
								value={inputText}
								onChange={(_, { value }) =>
									updateInputText(value)
								}
							/>
						</Form.Group>
					</Form>

					<StyledItemGroup>
						{!props.isFetchingData ? (
							<div>
								{filteredOptions
									.filter((option) =>
										option.value
											.toLowerCase()
											.startsWith(inputText.toLowerCase())
									)
									.map(
										(
											option: InterfaceFilteredOptionsProps,
											index
										) => (
											<CheckboxItem
												key={option.value}
												index={index}
												option={option}
												handleToggleCheckbox={
													handleToggleCheckbox
												}
											/>
										)
									)}
								{options
									.filter((option) =>
										option.value
											.toLowerCase()
											.startsWith(inputText.toLowerCase())
									)
									.map(
										(option, index) =>
											!option.isChecked && (
												<CheckboxItem
													key={option.value}
													index={index}
													option={option}
													handleToggleCheckbox={
														handleToggleCheckbox
													}
												/>
											)
									)}
							</div>
						) : (
							<Dimmer active inverted>
								<Loader />
							</Dimmer>
						)}
					</StyledItemGroup>
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button
					size="mini"
					icon
					disabled={filteredOptions.length === 0}
					labelPosition="right"
					onClick={() => {
						// reset filter
						updateOptions(props.options);
						updateFilteredOptions([]);
					}}
				>
					<Icon name="undo" />
					Reset Filter
				</Button>
				<Statistic
					className="xs"
					label="showing"
					value={
						(filteredOptions.length === 0
							? options.length
							: filteredOptions.length) +
						" / " +
						options.length
					}
					floated="right"
				/>
			</Card.Content>
		</Card>
	);
};
