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
	Popup,
	SemanticShorthandContent,
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
	popupContent: SemanticShorthandContent;
}

const StyledCardHeader = styled(Card.Meta)`
	display: flex;
	justify-content: space-between;
`;

const StyledFormGroup = styled(Form.Group)`
	margin-bottom: 0 !important;
`;

const StyledItemGroup = styled(Item.Group)`
	overflow-y: scroll;
	height: 224px;
	min-height: 224px;
	margin-top: 0 !important;
`;

const StyledItem = styled(Item)<{ mute: string | undefined }>`
	& label {
		color: ${(props) =>
			props.mute !== undefined ? "#b3b3b3" : "#4a4f59"} !important;
	}
`;

const StyledItemExtra = styled(Item.Extra)`
	margin-bottom: 16px;
	line-height: 1em;
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
	<StyledItem mute={option.mute ? "" : undefined}>
		<Item.Content>
			<Item.Description>
				<Checkbox
					label={option.value}
					checked={option.isChecked}
					onChange={() =>
						handleToggleCheckbox(index, option.isChecked)
					}
				/>
			</Item.Description>
			{option.description && (
				<StyledItemExtra key={option.value}>
					<small>{option.description}</small>
				</StyledItemExtra>
			)}
		</Item.Content>
	</StyledItem>
);

export const ColumnBrowser = ({
	title,
	filteredOptions,
	options,
	handleFilter,
	isFetchingData,
	popupContent,
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
				<StyledCardHeader>
					<span>
						<Icon name="filter" /> {title}
					</span>
					{popupContent && (
						<Popup
							size="small"
							inverted
							hoverable
							content={popupContent}
							trigger={<Icon name="info circle" />}
						/>
					)}
				</StyledCardHeader>
				<Card.Description>
					<Form>
						<StyledFormGroup widths="equal">
							<Form.Input
								icon="search"
								iconPosition="left"
								value={inputText}
								onChange={(_, { value }) =>
									updateInputText(value)
								}
							/>
						</StyledFormGroup>
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
						filteredOptions.forEach(
							(option) =>
								(tmp[option.orginalIndex].isChecked = false)
						);
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
