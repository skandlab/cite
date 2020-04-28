import React from "react";
import { Card, Statistic } from "semantic-ui-react";
import { HeatMap } from "../../plots/heatmap";
import { ColumnBrowserProps } from "./columnBrowser/columnBrowser";
import { InterfaceData } from "../../../utils/interfaces";

interface Props {
	data: InterfaceData[];
	interactionTypeOptions: ColumnBrowserProps[];
	tumorTypeOptions: ColumnBrowserProps[];
}

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
				<Card className="heatmapcard" key={index}>
					<Card.Content>
						<Card.Header>
							<Statistic.Group widths={2}>
								<Statistic className="extra" size="mini" text>
									<Statistic.Value>
										{_data.ligand}
									</Statistic.Value>
									<Statistic.Label>Ligand</Statistic.Label>
								</Statistic>
								<Statistic className="extra" size="mini" text>
									<Statistic.Value>
										{_data.receptor}
									</Statistic.Value>
									<Statistic.Label>Receptor</Statistic.Label>
								</Statistic>
							</Statistic.Group>
						</Card.Header>
						<Card.Description style={{ height: "320px" }}>
							<HeatMap
								data={_data.scoreMatrix}
								pairKeys={_pairKeys}
								tumorKeys={_tumorKeys}
							/>
						</Card.Description>
					</Card.Content>
				</Card>
			))}
		</Card.Group>
	);
};
