import React from "react";
import { RouteComponentProps } from "react-router-dom";
import styled from "@emotion/styled";

import { Grid, Segment, Header, Card, Dimmer, Loader } from "semantic-ui-react";
import { PlotScatter } from "../plots/plotScatter";
import { PlotBar } from "../plots/plotBarplot";
import { GridColumn } from "../styled/gridColumn";

import { requestExp } from "../../utils/backendRequests";
import { browserHistory } from "../../utils/browserHistory";

import { ROUTER_PARAMS_PURITY, ROUTES } from "../../utils/routes";

interface Props extends RouteComponentProps<ROUTER_PARAMS_PURITY> {}

interface InterfacePlotData {
	gene: string;
	tumorType: string;
	scatterplot: {
		name: string;
		value: [number, number];
	}[];
	barplot: {
		name: string;
		value: number;
	}[];
	lineplot: {
		name: string;
		value: [number, number];
	}[];
}

interface State {
	isFetchingData: boolean;
	dataArray: InterfacePlotData[];
}

const PlotCardGroup = styled(Card.Group)`
	padding: 0 !important;
`;

const PlotGroup = (props: {
	title: string;
	subHeader: string;
	data: InterfacePlotData;
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

export class ExpressionPage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			isFetchingData: true,
			dataArray: [],
		};
	}

	componentDidMount() {
		requestExp(
			[
				this.props.match.params.ligandFromRoute,
				this.props.match.params.receptorFromRoute,
			],
			this.props.match.params.tumorTypeFromRoute
		)
			.then((resp) =>
				this.setState({
					dataArray: resp.data,
					isFetchingData: false,
				})
			)
			.catch((_) => browserHistory.push(ROUTES.Error.push()));
	}

	render() {
		return !this.state.isFetchingData ? (
			this.state.dataArray.map((data) => (
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
			))
		) : (
			<Dimmer active inverted page>
				<Loader size="huge" />
			</Dimmer>
		);
	}
}
