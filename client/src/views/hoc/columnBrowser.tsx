import React, { useState } from "react";
import styled from "@emotion/styled";
import {
	Button,
	Card,
	Checkbox,
	Form,
	Icon,
	Item,
	Popup,
	SemanticShorthandContent,
	Statistic,
	Dimmer,
	Loader,
} from "semantic-ui-react";
import Interweave from "interweave";

export interface ColumnBrowserType {
	index: number;
	value: string;
	mute: boolean;
	isChecked: boolean;
	description?: string;
}

interface Props {
	index: number;
	title: string;
	popupContent: SemanticShorthandContent;
	options: ColumnBrowserType[];
	filteredOptions: ColumnBrowserType[];
	loading: boolean;
	handleToggleCheckbox: (
		index: number,
		selectedOption: ColumnBrowserType,
		selectedIndex: number
	) => void;
	handleReset: (index: number) => void;
}

export const ColumnBrowser = ({
	index,
	title,
	popupContent,
	options,
	filteredOptions,
	loading,
	handleToggleCheckbox,
	handleReset,
}: Props) => {
	const [inputText, updateInputText] = useState("");

	return (
		<Card>
			<Dimmer active={loading} inverted>
				<Loader inverted />
			</Dimmer>
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
							content={
								<Interweave content={popupContent as string} />
							}
							trigger={<Icon name="info circle" />}
						/>
					)}
				</StyledCardHeader>
				<Card.Description>
					<StyledForm>
						<Form.Input
							data-testid={index.toString() + "_filterInput"}
							icon="search"
							iconPosition="left"
							value={inputText}
							onChange={(_, { value }) => updateInputText(value)}
						/>
					</StyledForm>

					<StyledItemGroup
						data-testid={index.toString() + "_checkbox-list"}
					>
						{filteredOptions.map(
							(option, optionIndex) =>
								option.value
									.toLowerCase()
									.startsWith(inputText.toLowerCase()) && (
									<StyledCheckbox
										key={option.value}
										option={option}
										optionIndex={optionIndex}
										index={index}
										handleToggleCheckbox={
											handleToggleCheckbox
										}
									/>
								)
						)}
						{options.map(
							(option, optionIndex) =>
								option.value
									.toLowerCase()
									.startsWith(inputText.toLowerCase()) &&
								!option.isChecked && (
									<StyledCheckbox
										key={option.value}
										option={option}
										optionIndex={optionIndex}
										index={index}
										handleToggleCheckbox={
											handleToggleCheckbox
										}
									/>
								)
						)}
					</StyledItemGroup>
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button
					data-testid={index.toString() + "_resetButton"}
					size="mini"
					labelPosition="right"
					icon
					disabled={filteredOptions.length === 0}
					onClick={() => {
						updateInputText("");
						handleReset(index);
					}}
				>
					<Icon name="undo" />
					Reset Filter
				</Button>
				<Statistic
					data-testid={index.toString() + "_statistic"}
					className="xs"
					label="showing"
					floated="right"
					value={filteredOptions.length + " / " + options.length}
				/>
			</Card.Content>
		</Card>
	);
};

interface StyledCheckboxProps {
	index: number;
	option: ColumnBrowserType;
	optionIndex: number;
	handleToggleCheckbox: (
		index: number,
		selectedOption: ColumnBrowserType,
		selectedIndex: number
	) => void;
}

const StyledCheckbox = ({
	index,
	option,
	optionIndex,
	handleToggleCheckbox,
}: StyledCheckboxProps) => (
	<StyledItem mute={option.mute ? "" : undefined}>
		<Item.Content>
			<Item.Description>
				<Checkbox
					data-testid={option.value}
					label={option.value}
					checked={option.isChecked}
					onChange={() =>
						handleToggleCheckbox(
							index,
							{ ...option, isChecked: !option.isChecked },
							optionIndex
						)
					}
				/>
			</Item.Description>
			{option.description && (
				<StyledItemExtra>
					<small>{option.description}</small>
				</StyledItemExtra>
			)}
		</Item.Content>
	</StyledItem>
);

const StyledItem = styled(Item)`
	margin: 0 !important;
	padding: 0 !important;

	& label {
		color: ${(props) =>
			props.mute !== undefined ? "#b3b3b3" : "#4a4f59"} !important;
	}
`;

const StyledItemGroup = styled(Item.Group)`
	overflow-y: scroll;
	height: 224px;
	min-height: 224px;
	margin-top: 0 !important;
`;

const StyledCardHeader = styled(Card.Meta)`
	display: flex;
	justify-content: space-between;
`;

const StyledForm = styled(Form)`
	& .field:last-child {
		margin-bottom: 0.5em !important;
	}
`;

const StyledItemExtra = styled(Item.Extra)`
	margin: 0 !important;
	color: rgba(0, 0, 0, 0.6) !important;
`;
