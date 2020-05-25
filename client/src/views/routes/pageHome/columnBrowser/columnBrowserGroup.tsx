import React from "react";

import { Card, Dimmer, Loader, Icon } from "semantic-ui-react";
import { ColumnBrowser, InterfaceFilteredOptionsProps } from "./columnBrowser";

import { InterfaceColumnBrowserItem } from "../../../../utils/interfaces";
import { InterfaceColumnBrowser } from "..";
import { ROUTES } from "../../../../utils/routes";

interface Props {
	ligand: InterfaceColumnBrowser;
	receptor: InterfaceColumnBrowser;
	interaction: InterfaceColumnBrowser;
	tumor: InterfaceColumnBrowser;

	// ColumnBrowserConfigArray: InterfaceColumnBrowserConfig[];
	isFetchingData: boolean;
	handleFilter: (
		filteredOptions: InterfaceFilteredOptionsProps[],
		options: InterfaceColumnBrowserItem[],
		whichOption: {
			ligand: boolean;
			receptor: boolean;
			interaction: boolean;
			tumor: boolean;
		}
	) => void;
}

export const ColumnBrowserGroup = (props: Props) =>
	props.ligand.options.length !== 0 ||
	props.receptor.options.length !== 0 ||
	props.interaction.options.length !== 0 ||
	props.tumor.options.length !== 0 ? (
		<Card.Group centered doubling stackable>
			<ColumnBrowser
				{...props.ligand}
				{...props}
				handleFilter={(value1, value2) =>
					props.handleFilter(value1, value2, {
						ligand: false,
						receptor: false,
						interaction: false,
						tumor: false,
						...props.ligand.handler,
					})
				}
				popupContent={
					<p>
						if no associated heatmap present then gene will be
						dimmed
					</p>
				}
			/>
			<ColumnBrowser
				{...props.receptor}
				{...props}
				handleFilter={(value1, value2) =>
					props.handleFilter(value1, value2, {
						ligand: false,
						receptor: false,
						interaction: false,
						tumor: false,
						...props.receptor.handler,
					})
				}
				popupContent={
					<p>
						if no associated heatmap present then gene will be
						dimmed
					</p>
				}
			/>
			<ColumnBrowser
				{...props.interaction}
				{...props}
				handleFilter={(value1, value2) =>
					props.handleFilter(value1, value2, {
						ligand: false,
						receptor: false,
						interaction: false,
						tumor: false,
						...props.interaction.handler,
					})
				}
				popupContent={
					<p>
						read more on interaction type in{" "}
						<a
							href={ROUTES.About.push()}
							target="_blank"
							rel="noopener noreferrer"
						>
							about page
						</a>
						<sup>
							{" "}
							<Icon
								name="external alternate"
								size="small"
								fitted
							/>
						</sup>
					</p>
				}
			/>
			<ColumnBrowser
				{...props.tumor}
				{...props}
				handleFilter={(value1, value2) =>
					props.handleFilter(value1, value2, {
						ligand: false,
						receptor: false,
						interaction: false,
						tumor: false,
						...props.tumor.handler,
					})
				}
				popupContent={null}
			/>
		</Card.Group>
	) : (
		<Dimmer active inverted page>
			<Loader size="huge" />
		</Dimmer>
	);
