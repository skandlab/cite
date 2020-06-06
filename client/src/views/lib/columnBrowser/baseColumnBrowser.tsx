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
} from "semantic-ui-react";

export interface ColumnBrowserType {
	index: number;
	value: string;
	mute: boolean;
	isChecked: boolean;
	description?: string;
}

interface Props {
	title: string;
	options: ColumnBrowserType[];
	totalChecked: number;
	popupContent: SemanticShorthandContent;
	handleToggleCheckbox: (option: ColumnBrowserType, index: number) => void;
	handleReset: () => void;
}

/**
 *
 * @param props
 *
 * to test:
 * rendering:
 * 		1. title
 * 		2. checkboxlist
 * 		3, reset button
 * 		4. no of checked
 * events:
 * 		1. input filter
 */
export const BaseColumnBrowser = (props: Props) => {
	const [inputText, updateInputText] = useState("");

	return (
		<Card>
			<Card.Content>
				<StyledCardHeader>
					<span>
						<Icon name="filter" /> {props.title}
					</span>
					{props.popupContent && (
						<Popup
							size="small"
							inverted
							hoverable
							content={props.popupContent}
							trigger={<Icon name="info circle" />}
						/>
					)}
				</StyledCardHeader>
				<Card.Description>
					<StyledForm>
						<Form.Input
							data-testid="filterInput"
							icon="search"
							iconPosition="left"
							value={inputText}
							onChange={(_, { value }) => updateInputText(value)}
						/>
					</StyledForm>

					<StyledItemGroup data-testid="checkbox-list">
						{props.options.map((option, index) =>
							option.value
								.toLowerCase()
								.startsWith(inputText.toLowerCase()) ? (
								<StyledItem
									key={option.value}
									mute={option.mute ? "" : undefined}
								>
									<Item.Content>
										<Item.Description>
											<Checkbox
												data-testid={option.value}
												label={option.value}
												checked={option.isChecked}
												onChange={() =>
													props.handleToggleCheckbox(
														option,
														index
													)
												}
											/>
										</Item.Description>
										{option.description && (
											<StyledItemExtra key={option.value}>
												<small>
													{option.description}
												</small>
											</StyledItemExtra>
										)}
									</Item.Content>
								</StyledItem>
							) : null
						)}
					</StyledItemGroup>
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button
					data-testid="resetButton"
					size="mini"
					labelPosition="right"
					icon
					disabled={props.totalChecked === 0}
					onClick={() => {
						updateInputText("");
						props.handleReset();
					}}
				>
					<Icon name="undo" />
					Reset Filter
				</Button>
				<Statistic
					data-testid="statistic"
					className="xs"
					label="showing"
					floated="right"
					value={props.totalChecked + " / " + props.options.length}
				/>
			</Card.Content>
		</Card>
	);
};

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
