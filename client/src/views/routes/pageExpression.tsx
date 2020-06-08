import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import styled from "@emotion/styled";

import { Grid, Segment, Header, Card, Dimmer, Loader } from "semantic-ui-react";
import { PlotScatter } from "../plots/plotScatter";
import { PlotBar } from "../plots/plotBarplot";
import { GridColumn } from "../lib/gridColumn";

import { requestExp } from "../../utils/backendRequests";
import { browserHistory } from "../../utils/browserHistory";

import { ROUTER_PARAMS_EXPRESSION, ROUTES } from "../../utils/routes";
import { InterfaceExpressionEndpoint } from "../../utils/interfaces";

interface Props extends RouteComponentProps<ROUTER_PARAMS_EXPRESSION> {}

const PlotCardGroup = styled(Card.Group)`
	padding: 0 !important;
`;

export const ExpressionPage = (props: Props) => {
	const {
		ligandFromRoute,
		receptorFromRoute,
		tumorTypeFromRoute,
	} = props.match.params;
	const [state, updateState] = useState<{
		isFetchingData: boolean;
		dataArray: InterfaceExpressionEndpoint[];
	}>({
		isFetchingData: true,
		dataArray: [],
	});

	useEffect(() => {
		requestExp([ligandFromRoute, receptorFromRoute], tumorTypeFromRoute)
			.then((resp) =>
				updateState({
					dataArray: resp.data,
					isFetchingData: false,
				})
			)
			.catch((_) => browserHistory.push(ROUTES.Error.push()));
	}, [ligandFromRoute, receptorFromRoute, tumorTypeFromRoute]);

	return !state.isFetchingData ? (
		<>
			{state.dataArray.map((data) => (
				<React.Fragment key={data.gene}>
					<Grid.Row centered>
						<GridColumn>
							<PlotGroup
								title={data.gene}
								subHeader={data.tumorType}
								data={data}
							/>
						</GridColumn>
					</Grid.Row>
					<Grid.Row />
				</React.Fragment>
			))}
		</>
	) : (
		<Dimmer active inverted page>
			<Loader size="huge" />
		</Dimmer>
	);
};

const PlotGroup = (props: {
	title: string;
	subHeader: string;
	data: InterfaceExpressionEndpoint;
}) => (
	<Segment textAlign="center">
		<Header as="h3">
			{props.title}
			<Header.Subheader>{props.subHeader}</Header.Subheader>
		</Header>
		<PlotCardGroup centered itemsPerRow={2}>
			{props.data.scatterplot && (
				<Card>
					<Card.Content>
						<PlotScatter
							scatterPlotData={props.data.scatterplot}
							linePlotData={props.data.lineplot}
							xAxisName="Tumor Purity"
							yAxisName="log2 (fpkm + 1)"
						/>
					</Card.Content>
				</Card>
			)}

			{props.data.barplot && (
				<Card>
					<Card.Content>
						<PlotBar
							barPlotData={props.data.barplot}
							xAxisName="Cell Type"
							yAxisName="log2 (fpkm + 1)"
						/>
					</Card.Content>
				</Card>
			)}
		</PlotCardGroup>
	</Segment>
);
