import React from "react";
import styled from "@emotion/styled";
import { Card, Container } from "semantic-ui-react";
import { HeatMapCard, HeatmapCardProps } from "./heatmap";

interface HeatmapCardGroupProps {
	scoreDataList: HeatmapCardProps[];
}

export const HeatMapCardGroup = ({ scoreDataList }: HeatmapCardGroupProps) =>
	scoreDataList.length === 0 ? (
		<StyledContainer textAlign="center">
			<em>No Ligand-Receptor combination found.</em>
		</StyledContainer>
	) : (
		<StyledCardGroup data-tour="heatmapcards" centered doubling>
			{scoreDataList.map((scoreData, index) => (
				<HeatMapCard key={index} {...scoreData} />
			))}
		</StyledCardGroup>
	);

const StyledCardGroup = styled(Card.Group)`
	justify-content: space-around !important;
`;

const StyledContainer = styled(Container)`
	font-size: 20px;
	height: 30vh;
`;
