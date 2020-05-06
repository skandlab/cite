import React from "react";
import styled from "@emotion/styled";

import { Card, Statistic } from "semantic-ui-react";
import { PlotHeatMap } from "../../plots/plotHeatmap";

import { InterfaceScores } from "../../../utils/interfaces";
import { ROUTES } from "../../../utils/routes";

interface Props {
	listInteraction: string[];
	listTumor: string[];
	paginationData: InterfaceScores[];
}

const StyledHeatmapCard = styled(Card)`
	margin: 3em 0.8em !important;
`;

const StyledHeatmapCardDescriptor = styled(Card.Description)`
	height: 400px !important;
`;

export const HeatMapCards = (props: Props) => (
	<Card.Group centered doubling itemsPerRow={4}>
		{props.paginationData.map((data, index) => (
			<StyledHeatmapCard key={index}>
				<Card.Content>
					<Card.Header>
						<Statistic.Group widths={2}>
							<Statistic
								className="xs"
								label="Ligand"
								value={data.ligand}
							/>
							<Statistic
								className="xs"
								label="Receptor"
								value={data.receptor}
							/>
						</Statistic.Group>
					</Card.Header>
					<StyledHeatmapCardDescriptor>
						<PlotHeatMap
							data={data.scoreMatrix}
							pairKeys={props.listInteraction}
							tumorKeys={props.listTumor}
							onHeatMapClick={(yKey) =>
								window.open(
									ROUTES.Expression.push(
										data.ligand,
										data.receptor,
										yKey
									),
									"_blank"
								)
							}
						/>
					</StyledHeatmapCardDescriptor>
				</Card.Content>
			</StyledHeatmapCard>
		))}
	</Card.Group>
);
