import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import styled from "@emotion/styled";

import { Grid, Segment, Header, Card, Dimmer, Loader } from "semantic-ui-react";
import { PlotScatter } from "../plots/plotScatter";
import { PlotBar } from "../plots/plotBarplot";
import { GridColumn } from "../containers/gridColumn";

import { requestExp, DeconvDataType } from "../../utils/backendRequests";
import { ROUTER_PARAMS_EXPRESSION } from "../../utils/routes";

interface Props extends RouteComponentProps<ROUTER_PARAMS_EXPRESSION> {}

const ExpressionPage = (props: Props) => {
	const {
		ligandFromRoute,
		receptorFromRoute,
		tumorTypeFromRoute,
	} = props.match.params;
	const [dataArray, updateDataArray] = useState<DeconvDataType[]>([]);

	useEffect(() => {
		requestExp(
			[ligandFromRoute, receptorFromRoute],
			tumorTypeFromRoute,
			(data) => updateDataArray(data)
		);
	}, [ligandFromRoute, receptorFromRoute, tumorTypeFromRoute]);

	return dataArray ? (
		<>
			{dataArray.map(({ gene, tumorType, ...restProps }) => (
				<React.Fragment key={gene}>
					<Grid.Row centered>
						<GridColumn>
							<Segment textAlign="center">
								<Header as="h3">
									{gene}
									<Header.Subheader>
										{tumorType}
									</Header.Subheader>
								</Header>
								<Card.Group centered itemsPerRow={2}>
									<StyledCard>
										<Card.Content>
											<PlotScatter
												{...restProps}
												xAxisName="Tumor Purity"
												yAxisName="log2 (fpkm + 1)"
											/>
										</Card.Content>
									</StyledCard>

									<StyledCard>
										<Card.Content>
											<PlotBar
												{...restProps}
												xAxisName="Cell Type"
												yAxisName="log2 (fpkm + 1)"
											/>
										</Card.Content>
									</StyledCard>
								</Card.Group>
							</Segment>
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

const StyledCard = styled(Card)`
	min-width: 400px;
`;

export default ExpressionPage;
