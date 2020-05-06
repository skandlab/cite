import React from "react";

import { Card, Dimmer, Loader } from "semantic-ui-react";
import { ColumnBrowser } from "./columnBrowser";

import { InterfaceColumnBrowserProps } from "../../../../utils/interfaces";
import { InterfaceColumnBrowserConfig } from "..";

interface Props {
	ligandOptions: InterfaceColumnBrowserProps[];
	receptorOptions: InterfaceColumnBrowserProps[];
	interactionOptions: InterfaceColumnBrowserProps[];
	tumorOptions: InterfaceColumnBrowserProps[];
	ColumnBrowserConfigArray: InterfaceColumnBrowserConfig[];
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

export const ColumnBrowserGroup = (props: Props) =>
	props.ligandOptions.length !== 0 ? (
		<Card.Group centered doubling stackable>
			{props.ColumnBrowserConfigArray.map((config) => (
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
