import React from "react";
import { Card, Statistic } from "semantic-ui-react";
import { InterfaceData } from ".";
import { HeatMap } from "../../plots/heatmap";
import { ColumnBrowserProps } from "./columnBrowser/columnBrowser";

interface Props {
	data: InterfaceData[];
	pairsOptions: ColumnBrowserProps[];
	tumorOptions: ColumnBrowserProps[];
}

export const HeatMapCards = (props: Props) => {
	let _pairKeys = props.pairsOptions
		.filter((pair) => pair.isChecked)
		.map((pair) => pair.value);
	let _tumorKeys = props.tumorOptions
		.filter((tumor) => tumor.isChecked)
		.map((tumor) => tumor.value);

	if (_pairKeys.length === 0) {
		_pairKeys = props.pairsOptions.map((pair) => pair.value);
	}
	if (_tumorKeys.length === 0) {
		_tumorKeys = props.tumorOptions.map((tumor) => tumor.value);
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
