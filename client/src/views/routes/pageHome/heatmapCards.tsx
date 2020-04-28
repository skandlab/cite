import React from "react";
import { Card, Statistic } from "semantic-ui-react";
import { HeatMap } from "../../plots/heatmap";
import { ColumnBrowserProps } from "./columnBrowser/columnBrowser";
import { InterfaceData } from "../../../utils/interfaces";
import styled from "@emotion/styled";

interface Props {
	data: InterfaceData[];
	interactionTypeOptions: ColumnBrowserProps[];
	tumorTypeOptions: ColumnBrowserProps[];
}

const StyledHeatmapCard = styled(Card)`
	margin: 3em 0 !important;
`;

const StyledHeatmapCardDescriptor = styled(Card.Description)`
	height: 320px !important;
`;

export const HeatMapCards = (props: Props) => {
	let _pairKeys = props.interactionTypeOptions
		.filter((pair) => pair.isChecked)
		.map((pair) => pair.value);
	let _tumorKeys = props.tumorTypeOptions
		.filter((tumorType) => tumorType.isChecked)
		.map((tumorType) => tumorType.value);

	if (_pairKeys.length === 0) {
		_pairKeys = props.interactionTypeOptions.map((pair) => pair.value);
	}
	if (_tumorKeys.length === 0) {
		_tumorKeys = props.tumorTypeOptions.map((tumorType) => tumorType.value);
	}

	return (
		<Card.Group centered>
			{props.data.map((_data, index) => (
				<StyledHeatmapCard key={index}>
					<Card.Content>
						<Card.Header>
							<Statistic.Group widths={2}>
								<Statistic
									className="xs"
									label="Ligand"
									value={_data.ligand}
								/>
								<Statistic
									className="xs"
									label="Receptor"
									value={_data.receptor}
								/>
							</Statistic.Group>
						</Card.Header>
						<StyledHeatmapCardDescriptor>
							<HeatMap
								data={_data.scoreMatrix}
								pairKeys={_pairKeys}
								tumorKeys={_tumorKeys}
							/>
						</StyledHeatmapCardDescriptor>
					</Card.Content>
				</StyledHeatmapCard>
			))}
		</Card.Group>
	);
};
