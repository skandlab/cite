import React from "react";

import { Card, Dimmer, Loader } from "semantic-ui-react";
import { ColumnBrowser, InterfaceFilteredOptionsProps } from "./columnBrowser";

import { InterfaceColumnBrowserItem } from "../../../../utils/interfaces";
import { InterfaceColumnBrowser } from "..";

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
			/>
		</Card.Group>
	) : (
		<Dimmer active inverted page>
			<Loader size="huge" />
		</Dimmer>
	);
