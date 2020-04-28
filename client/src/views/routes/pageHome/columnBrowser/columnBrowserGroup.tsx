import React from "react";
import { Card } from "semantic-ui-react";
import { ColumnBrowser, ColumnBrowserProps } from "./columnBrowser";

interface Props {
	ligandOptions: ColumnBrowserProps[];
	receptorOptions: ColumnBrowserProps[];
	tumorOptions: ColumnBrowserProps[];
	pairsOptions: ColumnBrowserProps[];
	updateLigandOrReceptor: (
		ligandOptions: ColumnBrowserProps[],
		receptorOptions: ColumnBrowserProps[]
	) => void;
	updateTumorOptions: (data: ColumnBrowserProps[]) => void;
	updatePairsOptions: (data: ColumnBrowserProps[]) => void;
}

export const ColumnBrowserGroup = (props: Props) => (
	<Card.Group centered doubling stackable>
		<ColumnBrowser
			title="Ligand"
			options={props.ligandOptions}
			updateOptions={(value) =>
				props.updateLigandOrReceptor(value, props.receptorOptions)
			}
		/>
		<ColumnBrowser
			title="Receptor"
			options={props.receptorOptions}
			updateOptions={(value) =>
				props.updateLigandOrReceptor(props.ligandOptions, value)
			}
		/>
		<ColumnBrowser
			title="Interaction type"
			options={props.pairsOptions}
			updateOptions={(value) => props.updatePairsOptions(value)}
		/>
		<ColumnBrowser
			title="Tumor type"
			options={props.tumorOptions}
			updateOptions={(value) => props.updateTumorOptions(value)}
		/>
	</Card.Group>
);
