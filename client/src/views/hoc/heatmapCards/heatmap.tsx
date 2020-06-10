import React from "react";
import styled from "@emotion/styled";
import { Card, Statistic } from "semantic-ui-react";
import { PlotHeatMap } from "../../plots/plotHeatmap";
import { ROUTES } from "../../../utils/routes";
import { HeatmapCardType } from "../../../utils/interfaces";

export interface HeatmapCardProps extends HeatmapCardType {}

export const HeatMapCard = ({ ligand, receptor, data }: HeatmapCardProps) => (
	<StyledCard data-testid="displayCard">
		<Card.Content>
			<Card.Header>
				<Statistic.Group widths={2}>
					<Statistic className="xs" label="Ligand" value={ligand} />
					<Statistic
						className="xs"
						label="Receptor"
						value={receptor}
					/>
				</Statistic.Group>
			</Card.Header>
			<StyledCardDescription>
				<PlotHeatMap
					data={data}
					onHeatMapClick={(yKey: string) =>
						window.open(
							ROUTES.Expression.push(ligand, receptor, yKey),
							"_blank"
						)
					}
				/>
			</StyledCardDescription>
		</Card.Content>
	</StyledCard>
);

const StyledCard = styled(Card)`
	margin: 3em 0.8em !important;
`;

const StyledCardDescription = styled(Card.Description)`
	height: 400px !important;
`;
