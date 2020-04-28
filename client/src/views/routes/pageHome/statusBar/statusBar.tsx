import React from "react";
import { Menu, Statistic, Form } from "semantic-ui-react";
import { ColorBar } from "./colorbar";
import { paginationText } from "../pagination";
import { InterfaceData } from "../../../../utils/interfaces";

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
							<Statistic
								label={<small>Total</small>}
								value={props.filteredData.length}
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
