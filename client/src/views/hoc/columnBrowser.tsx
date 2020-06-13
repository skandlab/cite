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
						{loading && (
							<span>
								<small>Loading...</small>
							</span>
						)}
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
	<StyledItemWrapper mute={option.mute}>
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
								index,
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
