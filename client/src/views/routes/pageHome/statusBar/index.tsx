import React from "react";
import { Menu, Statistic, Form, Card } from "semantic-ui-react";
import { ColorBar } from "./colorbar";
import { calculatePaginationItems } from "../pagination";

interface Props {
	totalItems: number;
	currentPageNumber: number;
}

export const StatusBar = (props: Props) => {
	let { start, end } = calculatePaginationItems(props.currentPageNumber);
	end = Math.min(end, props.totalItems);
	start = props.totalItems === 0 ? 0 : start + 1;

	return (
		<Menu className="nohover" secondary borderless>
			<Menu.Item>
				<Card>
					<Card.Content textAlign="center">
						<Form widths="equal">
							<Form.Group inline>
								<Form.Field>
									<Statistic
										label={<small>Total</small>}
										value={props.totalItems}
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
			</Menu.Item>
			<Menu.Menu position="right">
				<Menu.Item>
					<ColorBar />
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);
};
