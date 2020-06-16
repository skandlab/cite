import React from "react";
import { Card, Form, Statistic } from "semantic-ui-react";
import { calculatePaginationItems } from "../pagination";

interface Props {
	totalItems: number;
	currentPageNumber: number;
}

export const Summary = ({ totalItems, currentPageNumber }: Props) => {
	let { start, end } = calculatePaginationItems(currentPageNumber);
	end = Math.min(end, totalItems);
	start = totalItems === 0 ? 0 : start + 1;

	return (
		<Card data-tour="summary">
			<Card.Content textAlign="center">
				<Form widths="equal">
					<Form.Group inline>
						<Form.Field>
							<Statistic
								label={<small>Total</small>}
								value={totalItems}
								size="mini"
							/>
						</Form.Field>
						<Form.Field>
							<Statistic
								label={<small>Showing</small>}
								value={start + "-" + end}
								size="mini"
							/>
						</Form.Field>
					</Form.Group>
					<Form.Field>
						<label>Ligand-Receptor Combinations</label>
					</Form.Field>
				</Form>
			</Card.Content>
		</Card>
	);
};
