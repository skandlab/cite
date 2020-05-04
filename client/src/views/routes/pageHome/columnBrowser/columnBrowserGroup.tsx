import React from "react";

import { Card, Dimmer, Loader } from "semantic-ui-react";
import { ColumnBrowser } from "./columnBrowser";

import { InterfaceColumnBrowserProps } from "../../../../utils/interfaces";

interface Props {
	ligandOptions: InterfaceColumnBrowserProps[];
	receptorOptions: InterfaceColumnBrowserProps[];
	interactionOptions: InterfaceColumnBrowserProps[];
	tumorOptions: InterfaceColumnBrowserProps[];
	isFetchingData: boolean;
	handleFilter: (
		options: InterfaceColumnBrowserProps[],
		whichOption: {
			ligand: boolean;
			receptor: boolean;
			interaction: boolean;
			tumor: boolean;
		}
	) => void;
}

const ColumnBrowserConfigArray: {
	title: string;
	options: string;
	handler: { [key: string]: boolean };
}[] = [
	{ title: "Ligand", options: "ligandOptions", handler: { ligand: true } },
	{
		title: "Receptor",
		options: "receptorOptions",
		handler: { receptor: true },
	},
	{
		title: "Interaction type",
		options: "interactionOptions",
		handler: { interaction: true },
	},
	{ title: "Tumor type", options: "tumorOptions", handler: { tumor: true } },
];

export const ColumnBrowserGroup = (props: Props) =>
	props.ligandOptions.length !== 0 ? (
		<Card.Group centered doubling stackable>
			{ColumnBrowserConfigArray.map((config) => (
				<ColumnBrowser
					{...props}
					key={config.title}
					title={config.title}
					// @ts-ignore
					options={props[config.options]}
					handleFilter={(value) =>
						props.handleFilter(value, {
							ligand: false,
							receptor: false,
							interaction: false,
							tumor: false,
							...config.handler,
						})
					}
				/>
			))}
		</Card.Group>
	) : (
		<Dimmer active inverted page>
			<Loader size="huge" />
		</Dimmer>
	);
