import React from "react";
import { Menu, Statistic, Form } from "semantic-ui-react";
import { ColorBar } from "./colorbar";
import { InterfaceData } from "..";
import { paginationText } from "../pagination";

interface Props {
	filteredData: InterfaceData[];
	currentPageNumber: number;
}

export const StatusBar = (props: Props) => {
	const { start, end } = paginationText({
		...props,
		totalItems: props.filteredData.length,
	});

	return (
		<Menu className="nohover" secondary borderless>
			<Menu.Item>
				<Form>
					<Form.Group inline>
						<Form.Field>
							<label>Ligand-Receptor Combinations:</label>
						</Form.Field>
						<Form.Field>
							<Statistic text size="mini">
								<Statistic.Label>
									<small>Total</small>
								</Statistic.Label>
								<Statistic.Value>
									{props.filteredData.length}
								</Statistic.Value>
							</Statistic>
						</Form.Field>
						<Form.Field>
							<Statistic text size="mini">
								<Statistic.Label>
									<small>Showing</small>
								</Statistic.Label>
								<Statistic.Value>
									{start + "-" + end}
								</Statistic.Value>
							</Statistic>
						</Form.Field>
					</Form.Group>
				</Form>
			</Menu.Item>
			<Menu.Menu position="right">
				<Menu.Item>
					<ColorBar />
				</Menu.Item>
			</Menu.Menu>
		</Menu>
	);
};
