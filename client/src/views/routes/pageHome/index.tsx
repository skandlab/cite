import React from "react";
import axios from "axios";

import { Grid } from "semantic-ui-react";
import { GridColumn } from "../../styled/gridColumn";
import { HeatMapCards } from "./heatmapCards";
import { ColumnBrowserGroup } from "./columnBrowser/columnBrowserGroup";
import { StatusBar } from "./statusBar/statusBar";
import { AppPagination, calculatePaginationItems } from "./pagination";

import { browserHistory } from "../../../utils/browserHistory";
import {
	requestScores,
	requestCheckboxOptions,
} from "../../../utils/backendRequests";
import {
	InterfaceScores,
	InterfaceColumnBrowserProps,
} from "../../../utils/interfaces";

import { ROUTES } from "../../../utils/routes";

interface State {
	ligandOptions: InterfaceColumnBrowserProps[];
	receptorOptions: InterfaceColumnBrowserProps[];
	interactionOptions: InterfaceColumnBrowserProps[];
	tumorOptions: InterfaceColumnBrowserProps[];

	listLigand: string[];
	listReceptor: string[];
	listInteraction: string[];
	listTumor: string[];

	scoreData: InterfaceScores[];
	isFetchingData: boolean;
	currentPageNumber: number;
}

export class HomePage extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			ligandOptions: [],
			receptorOptions: [],
			interactionOptions: [],
			tumorOptions: [],
			listLigand: [],
			listReceptor: [],
			listInteraction: [],
			listTumor: [],
			scoreData: [],
			isFetchingData: true,
			currentPageNumber: 1,
		};
	}

	componentDidMount() {
		axios
			.all([requestCheckboxOptions(), requestScores([], [])])
			.then((resp) =>
				this.setState({
					...resp[0].data,
					listInteraction: resp[0].data["interactionOptions"].map(
						(option: InterfaceColumnBrowserProps) => option.value
					),
					listTumor: resp[0].data["tumorOptions"].map(
						(option: InterfaceColumnBrowserProps) => option.value
					),
					...resp[1].data,
					isFetchingData: false,
				})
			)
			.catch((_) => browserHistory.push(ROUTES.Error.push()));
	}

	handleFilter = (
		options: InterfaceColumnBrowserProps[],
		whichOption: {
			ligand: boolean;
			receptor: boolean;
			interaction: boolean;
			tumor: boolean;
		}
	) => {
		let listOptions = options.map((option) => option.value);

		if (whichOption.ligand) {
			this.setState({ isFetchingData: true }, () =>
				requestScores(listOptions, this.state.listReceptor)
					.then((resp) =>
						this.setState({
							scoreData: resp.data["scoreData"],
							receptorOptions: resp.data["receptorOptions"],
							listLigand: listOptions,
							isFetchingData: false,
							currentPageNumber: 1,
						})
					)
					.catch((_) => browserHistory.push(ROUTES.Error.push()))
			);
		} else if (whichOption.receptor) {
			this.setState({ isFetchingData: true }, () =>
				requestScores(this.state.listLigand, listOptions)
					.then((resp) => {
						this.setState({
							scoreData: resp.data["scoreData"],
							ligandOptions: resp.data["ligandOptions"],
							listReceptor: listOptions,
							isFetchingData: false,
							currentPageNumber: 1,
						});
					})
					.catch((_) => browserHistory.push(ROUTES.Error.push()))
			);
		} else if (whichOption.interaction) {
			this.setState({
				listInteraction:
					listOptions.length === 0
						? this.state.interactionOptions.map(
								(option) => option.value
						  )
						: listOptions,
			});
		} else {
			this.setState({
				listTumor:
					listOptions.length === 0
						? this.state.tumorOptions.map((option) => option.value)
						: listOptions,
			});
		}
	};

	render() {
		let { start, end } = calculatePaginationItems(
			this.state.currentPageNumber
		);
		return (
			<>
				<Grid.Row centered>
					<GridColumn>
						<ColumnBrowserGroup {...this.state} {...this} />
					</GridColumn>
				</Grid.Row>

				{this.state.scoreData.length !== 0 && (
					<Grid.Row centered>
						<GridColumn>
							<StatusBar
								totalItems={this.state.scoreData.length}
								{...this.state}
							/>
						</GridColumn>
					</Grid.Row>
				)}
				<Grid.Row />

				{this.state.scoreData.length !== 0 &&
					!this.state.isFetchingData && (
						<>
							<Grid.Row centered>
								<GridColumn>
									<HeatMapCards
										paginationData={this.state.scoreData.slice(
											start,
											end
										)}
										{...this.state}
									/>
								</GridColumn>
							</Grid.Row>
							<Grid.Row centered>
								<GridColumn>
									<AppPagination
										{...this.state}
										totalItems={this.state.scoreData.length}
										handleOnPageChange={(
											activePageNumber
										) =>
											this.setState({
												currentPageNumber: activePageNumber,
											})
										}
									/>
								</GridColumn>
							</Grid.Row>
						</>
					)}
			</>
		);
	}
}
