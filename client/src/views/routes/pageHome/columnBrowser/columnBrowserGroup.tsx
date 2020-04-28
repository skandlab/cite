import React from "react";
import { Card } from "semantic-ui-react";
import { ColumnBrowser, ColumnBrowserProps } from "./columnBrowser";

interface Props {
	ligandOptions: ColumnBrowserProps[];
	receptorOptions: ColumnBrowserProps[];
	tumorTypeOptions: ColumnBrowserProps[];
	interactionTypeOptions: ColumnBrowserProps[];
	updateLigandOrReceptor: (
		ligandOptions: ColumnBrowserProps[],
		receptorOptions: ColumnBrowserProps[],
		updateIsLigand: boolean
	) => void;
	updateTumorTypeOptions: (data: ColumnBrowserProps[]) => void;
	updateInteractionTypeOptions: (data: ColumnBrowserProps[]) => void;
}

export const ColumnBrowserGroup = (props: Props) => (
	<Card.Group centered doubling stackable>
		<ColumnBrowser
			title="Ligand"
			options={props.ligandOptions}
			updateOptions={(value) =>
				props.updateLigandOrReceptor(value, props.receptorOptions, true)
			}
		/>
		<ColumnBrowser
			title="Receptor"
			options={props.receptorOptions}
			updateOptions={(value) =>
				props.updateLigandOrReceptor(props.ligandOptions, value, false)
			}
		/>
		<ColumnBrowser
			title="Interaction type"
			options={props.interactionTypeOptions}
			updateOptions={(value) => props.updateInteractionTypeOptions(value)}
		/>
		<ColumnBrowser
			title="Tumor type"
			options={props.tumorTypeOptions}
			updateOptions={(value) => props.updateTumorTypeOptions(value)}
		/>
	</Card.Group>
);
