import React from "react";
import styled from "@emotion/styled";

import { Card, Statistic, Container } from "semantic-ui-react";
import { PlotHeatMap } from "../plots/plotHeatmap";

import { InterfaceScores } from "../../utils/interfaces";
import { ROUTES } from "../../utils/routes";

interface HeatMapCardsProps {
	xAxisFilterKeys: string[];
	yAxisFilterKeys: string[];
	data: InterfaceScores[];
}

export const HeatMapCards = (props: HeatMapCardsProps) => {
	const { data, ...restProps } = props;
	return data.length !== 0 ? (
		<StyledHeatmapCardGroup centered doubling>
			{data.map((_data, index) => (
				<HeatMapCard
					key={index}
					index={index}
					data={_data}
					{...restProps}
				/>
			))}
		</StyledHeatmapCardGroup>
	) : (
		<StyledContainer textAlign="center">
			<em>No Ligand-Receptor combination found.</em>
		</StyledContainer>
	);
};

interface HeatMapCardProps {
	data: InterfaceScores;
	index: number;
	xAxisFilterKeys: string[];
	yAxisFilterKeys: string[];
}

const HeatMapCard = ({ index, data, ...restProps }: HeatMapCardProps) => {
	const onHeatMapClick = (yKey: string) =>
		window.open(ROUTES.Expression.push(ligand, receptor, yKey), "_blank");

	const { ligand, receptor, scoreMatrix } = data;

	return (
		<StyledHeatmapCard key={index} data-testid="displayCard">
			<Card.Content>
				<Card.Header>
					<Statistic.Group widths={2}>
						<Statistic
							className="xs"
							label="Ligand"
							value={ligand}
						/>
						<Statistic
							className="xs"
							label="Receptor"
							value={receptor}
						/>
					</Statistic.Group>
				</Card.Header>
				<StyledHeatmapCardDescriptor>
					<PlotHeatMap
						{...restProps}
						data={scoreMatrix}
						onHeatMapClick={onHeatMapClick}
					/>
				</StyledHeatmapCardDescriptor>
			</Card.Content>
		</StyledHeatmapCard>
	);
};

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
