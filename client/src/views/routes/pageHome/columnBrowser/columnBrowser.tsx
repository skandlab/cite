import React, { useState } from "react";
import {
	Item,
	Checkbox,
	Icon,
	Form,
	Card,
	Statistic,
	Button,
} from "semantic-ui-react";
import styled from "@emotion/styled";

export interface ColumnBrowserProps {
	description?: string;
	value: string;
	isChecked: boolean;
}

interface Props {
	title: string;
	options: ColumnBrowserProps[];
	updateOptions: (options: ColumnBrowserProps[]) => void;
}

const StyledItemGroup = styled(Item.Group)`
	overflow-y: scroll;
	height: 160px;
`;

export const ColumnBrowser = (props: Props) => {
	const [currentFilteredStatistic, updateCurrentFilteredStatistic] = useState(
		0
	);
	const [inputText, updateInputText] = useState("");

	/*
	 * handle click on a checkbox
	 * empty array means `all`
	 */
	const handleToggleCheckbox = (index: number, prevChecked: boolean) => {
		props.updateOptions([
			...props.options.slice(0, index),
			{ ...props.options[index], isChecked: !prevChecked },
			...props.options.slice(index + 1, props.options.length),
		]);
		updateCurrentFilteredStatistic(
			prevChecked
				? currentFilteredStatistic - 1
				: currentFilteredStatistic + 1
		);
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
						{props.options
							.filter((option) =>
								option.value
									.toLowerCase()
									.startsWith(inputText.toLowerCase())
							)
							.map((option, index) => (
								<Item
									key={option.value}
									meta={
										option.description && (
											<>
												<small>
													{option.description}
												</small>
												<br />
											</>
										)
									}
									description={
										<Checkbox
											label={option.value}
											checked={option.isChecked}
											onChange={() =>
												handleToggleCheckbox(
													index,
													option.isChecked
												)
											}
										/>
									}
								/>
							))}
					</StyledItemGroup>
				</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<Button
					size="mini"
					icon
					labelPosition="right"
					onClick={() => {
						props.updateOptions(
							props.options.map((option) => {
								return {
									...option,
									isChecked: false,
								};
							})
						);
						updateCurrentFilteredStatistic(0);
					}}
				>
					<Icon name="undo" />
					Reset Filter
				</Button>
				<Statistic
					className="xs"
					label="showing"
					value={
						(currentFilteredStatistic === 0
							? props.options.length
							: currentFilteredStatistic) +
						" /" +
						props.options.length
					}
					floated="right"
				/>
			</Card.Content>
		</Card>
	);
};
