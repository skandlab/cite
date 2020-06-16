import React, { useState } from "react";
import styled from "@emotion/styled";
import {
	Button,
	Card,
	Form,
	Icon,
	Item,
	Popup,
	SemanticShorthandContent,
	Statistic,
} from "semantic-ui-react";
import Interweave from "interweave";
import { ItemGroupLoader } from "../containers/itemGroupLoader";
import { ItemIsPresentType } from "../../utils/backendRequests";

export interface ColumnBrowserType {
	index: number;
	value: string;
	mute: boolean;
	isChecked: boolean;
	description?: string;
}

interface Props {
	filterIndex: number;
	title: string;
	popupContent: SemanticShorthandContent;
	options: ColumnBrowserType[];
	itemIsPresent: ItemIsPresentType["itemIsPresent"];
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
	filterIndex,
	title,
	popupContent,
	options,
	itemIsPresent,
	filteredOptions,
	loading,
	handleToggleCheckbox,
	handleReset,
}: Props) => {
	const [inputText, updateInputText] = useState("");

	let checkboxArray1: React.ReactElement[] = [];
	let checkboxArray2: React.ReactElement[] = [];
	let checkboxArray3: React.ReactElement[] = [];
	let arr1Index = 0;
	let arr23Index = 0;

	options.forEach((option) => {
		if (option.value.toLowerCase().startsWith(inputText.toLowerCase())) {
			if (option.isChecked) {
				checkboxArray1.push(
					<StyledCheckbox
						key={option.value}
						mute={false}
						option={option}
						optionIndex={arr1Index}
						filterIndex={filterIndex}
						handleToggleCheckbox={handleToggleCheckbox}
					/>
				);
				arr1Index++;
			} else {
				if (!itemIsPresent[option.value]) {
					checkboxArray2.push(
						<StyledCheckbox
							key={option.value}
							mute={false}
							option={option}
							optionIndex={arr23Index}
							filterIndex={filterIndex}
							handleToggleCheckbox={handleToggleCheckbox}
						/>
					);
				} else {
					checkboxArray3.push(
						<StyledCheckbox
							key={option.value}
							mute={true}
							option={option}
							optionIndex={arr23Index}
							filterIndex={filterIndex}
							handleToggleCheckbox={handleToggleCheckbox}
						/>
					);
				}
				arr23Index++;
			}
		}
	});

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
							data-tour={filterIndex.toString() + "_filterInput"}
							data-testid={
								filterIndex.toString() + "_filterInput"
							}
							icon="search"
							iconPosition="left"
							value={inputText}
							onChange={(_, { value }) => updateInputText(value)}
						/>
					</StyledForm>

					<StyledItemGroup
						data-tour={filterIndex.toString() + "_checkbox-list"}
					>
						{loading ? (
							<ItemGroupLoader />
						) : (
							<div
								data-testid={
									filterIndex.toString() + "_checkbox-list"
								}
							>
								{checkboxArray1}
								{checkboxArray2}
								{checkboxArray3}
							</div>
						)}
					</StyledItemGroup>
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button
					data-tour={filterIndex.toString() + "_resetButton"}
					data-testid={filterIndex.toString() + "_resetButton"}
					size="mini"
					labelPosition="right"
					icon
					disabled={filteredOptions.length === 0}
					onClick={() => {
						updateInputText("");
						handleReset(filterIndex);
					}}
				>
					<Icon name="undo" />
					Reset Filter
				</Button>
				<Statistic
					data-tour={filterIndex.toString() + "_statistic"}
					data-testid={filterIndex.toString() + "_statistic"}
					className="xs"
					label="filtered"
					floated="right"
					value={filteredOptions.length + " / " + options.length}
				/>
			</Card.Content>
		</Card>
	);
};

interface StyledCheckboxProps {
	filterIndex: number;
	mute: boolean;
	option: ColumnBrowserType;
	optionIndex: number;
	handleToggleCheckbox: (
		filterIndex: number,
		selectedOption: ColumnBrowserType,
		selectedIndex: number
	) => void;
}

const StyledCheckbox = ({
	filterIndex,
	mute,
	option,
	optionIndex,
	handleToggleCheckbox,
}: StyledCheckboxProps) => (
	<StyledItemWrapper mute={mute}>
		<Item>
			<Item.Content>
				<Item.Description>
					<div
						data-testid={option.value}
						className={
							option.isChecked
								? "ui checked checkbox"
								: "ui checkbox"
						}
						onClick={() =>
							handleToggleCheckbox(
								filterIndex,
								{ ...option, isChecked: !option.isChecked },
								optionIndex
							)
						}
					>
						<input
							className="hidden"
							type="checkbox"
							tabIndex={0}
							checked={option.isChecked}
							onChange={() => null} // discard
							name={option.value + "_checkbox"}
						/>
						<label htmlFor={option.value + "_checkbox"}>
							{option.value}
						</label>
						{option.description && (
							<small>{option.description}</small>
						)}
					</div>
				</Item.Description>
			</Item.Content>
		</Item>
	</StyledItemWrapper>
);

const StyledItemWrapper = styled.div<{ mute: boolean }>`
	padding: 0.7em 0.1em;
	& label,
	small {
		color: ${(props) => (props.mute ? "#b3b3b3" : "#4a4f59")} !important;
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
