import React, { useState } from "react";
import styled from "@emotion/styled";

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

import { InterfaceColumnBrowserItem } from "../../../../utils/interfaces";

export interface InterfaceFilteredOptionsProps
	extends InterfaceColumnBrowserItem {
	orginalIndex: number;
}

interface Props {
	title: string;
	filteredOptions: InterfaceFilteredOptionsProps[];
	options: InterfaceColumnBrowserItem[];
	handleFilter: (
		filteredOptions: InterfaceFilteredOptionsProps[],
		options: InterfaceColumnBrowserItem[]
	) => void;
	isFetchingData: boolean;
}

const StyledItemGroup = styled(Item.Group)`
	overflow-y: scroll;
	height: 160px;
	min-height: 160px;
`;

const StyledItem = styled.div<{ mute: boolean }>`
	margin-top: 0 !important;
	& label {
		color: ${(props) => (props.mute ? "#b3b3b3" : "#4a4f59")} !important;
	}
`;
const CheckboxItem = ({
	index,
	option,
	handleToggleCheckbox,
}: {
	index: number;
	option: InterfaceColumnBrowserItem;
	handleToggleCheckbox: Function;
}) => (
	<StyledItem mute={option.mute}>
		<Item
			key={option.value}
			meta={
				option.description && (
					<>
						<small>{option.description}</small>
						<br />
					</>
				)
			}
			description={
				<Checkbox
					label={option.value}
					checked={option.isChecked}
					onChange={() =>
						handleToggleCheckbox(index, option.isChecked)
					}
				/>
			}
		/>
	</StyledItem>
);

export const ColumnBrowser = ({
	title,
	filteredOptions,
	options,
	handleFilter,
	isFetchingData,
}: Props) => {
	const [inputText, updateInputText] = useState("");

	const handleToggleCheckbox = (index: number, prevChecked: boolean) => {
		let tmpFilteredOptions: InterfaceFilteredOptionsProps[] = prevChecked
			? [
					...filteredOptions.slice(0, index),
					...filteredOptions.slice(index + 1, filteredOptions.length),
			  ]
			: [
					...filteredOptions,
					{
						...options[index],
						isChecked: !prevChecked,
						orginalIndex: index,
					},
			  ];
		let currentIndex = prevChecked
			? filteredOptions[index].orginalIndex
			: index;
		let tmpOptions: InterfaceColumnBrowserItem[] = [
			...options.slice(0, currentIndex),
			{ ...options[currentIndex], isChecked: !prevChecked },
			...options.slice(currentIndex + 1, options.length),
		];
		handleFilter(tmpFilteredOptions, tmpOptions);
	};

	return (
		<Card>
			<Card.Content>
				<Card.Meta>
					<Icon name="filter" /> {title}
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
						{!isFetchingData ? (
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
											index: number
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
										(option) =>
											!option.isChecked && (
												<CheckboxItem
													key={option.value}
													index={option.index}
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
						let tmp = options;
						filteredOptions.forEach((_, index) => {
							tmp[index].isChecked = false;
						});
						handleFilter([], tmp);
						updateInputText("");
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
