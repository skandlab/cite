import React from "react";
import styled from "@emotion/styled";

import { Card, Statistic, Container } from "semantic-ui-react";
import { PlotHeatMap } from "../../plots/plotHeatmap";

import { InterfaceScores } from "../../../utils/interfaces";
import { ROUTES } from "../../../utils/routes";

interface Props {
	listInteraction: string[];
	listTumor: string[];
	paginationData: InterfaceScores[];
}

const StyledHeatmapCardGroup = styled(Card.Group)`
	justify-content: space-around !important;
`;

const StyledHeatmapCard = styled(Card)`
	margin: 3em 0.8em !important;
`;

const StyledHeatmapCardDescriptor = styled(Card.Description)`
	height: 400px !important;
`;

const StyledContainer = styled(Container)`
	font-size: 20px;
	height: 30vh;
`;

export const HeatMapCards = (props: Props) =>
	props.paginationData.length !== 0 ? (
		<StyledHeatmapCardGroup centered doubling>
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
		</StyledHeatmapCardGroup>
	) : (
		<StyledContainer textAlign="center">
			<em>No Ligand-Receptor combination found.</em>
		</StyledContainer>
	);
