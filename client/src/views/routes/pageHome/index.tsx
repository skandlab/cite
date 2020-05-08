import React from "react";
import axios from "axios";

import { Grid } from "semantic-ui-react";
import { GridColumn } from "../../styled/gridColumn";
import { HeatMapCards } from "./heatmapCards";
import { ColumnBrowserGroup } from "./columnBrowser/columnBrowserGroup";
import { StatusBar } from "./statusBar";
import { AppPagination, calculatePaginationItems } from "./pagination";

import { browserHistory } from "../../../utils/browserHistory";
import {
	requestScores,
	requestCheckboxOptions,
} from "../../../utils/backendRequests";
import {
	InterfaceScores,
	InterfaceColumnBrowserItem,
} from "../../../utils/interfaces";

import { ROUTES } from "../../../utils/routes";
import { InterfaceFilteredOptionsProps } from "./columnBrowser/columnBrowser";

export interface InterfaceColumnBrowser {
	title: string;
	options: InterfaceColumnBrowserItem[];
	filteredOptions: InterfaceFilteredOptionsProps[];
	filteredList: string[];
	handler: {
		[key: string]: boolean;
	};
}

interface State {
	ligand: InterfaceColumnBrowser;
	receptor: InterfaceColumnBrowser;
	interaction: InterfaceColumnBrowser;
	tumor: InterfaceColumnBrowser;

	scoreData: InterfaceScores[];
	isFetchingData: boolean;
	currentPageNumber: number;
}

export class HomePage extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			ligand: {
				title: "Ligand",
				options: [],
				filteredOptions: [],
				filteredList: [],
				handler: {
					ligand: true,
				},
			},

			receptor: {
				title: "Receptor",
				options: [],
				filteredOptions: [],
				filteredList: [],
				handler: {
					receptor: true,
				},
			},

			interaction: {
				title: "Interaction type",
				options: [],
				filteredOptions: [],
				filteredList: [],
				handler: {
					interaction: true,
				},
			},

			tumor: {
				title: "Tumor type",
				options: [],
				filteredOptions: [],
				filteredList: [],
				handler: {
					tumor: true,
				},
			},

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
					ligand: {
						...this.state.ligand,
						options: resp[1].data["ligandOptions"],
					},
					receptor: {
						...this.state.receptor,
						options: resp[1].data["receptorOptions"],
					},
					interaction: {
						...this.state.interaction,
						options: resp[0].data["interactionOptions"],
						filteredList: resp[0].data["interactionOptions"].map(
							(option: InterfaceColumnBrowserItem) => option.value
						),
					},
					tumor: {
						...this.state.tumor,
						options: resp[0].data["tumorOptions"],
						filteredList: resp[0].data["tumorOptions"].map(
							(option: InterfaceColumnBrowserItem) => option.value
						),
					},
					scoreData: resp[1].data["scoreData"],
					isFetchingData: false,
				})
			)
			.catch((_) => browserHistory.push(ROUTES.Error.push()));
	}

	handleFilter = (
		filteredOptions: InterfaceFilteredOptionsProps[],
		options: InterfaceColumnBrowserItem[],
		whichOption: {
			ligand: boolean;
			receptor: boolean;
			interaction: boolean;
			tumor: boolean;
		}
	) => {
		let listOptions = filteredOptions.map((option) => option.value);

		if (whichOption.ligand) {
			this.setState(
				{
					isFetchingData: true,
				},
				() =>
					requestScores(listOptions, this.state.receptor.filteredList)
						.then((resp) =>
							this.setState({
								scoreData: resp.data["scoreData"],
								ligand: {
									...this.state.ligand,
									options: resp.data["ligandOptions"],
									filteredOptions: filteredOptions,
									filteredList: listOptions,
								},
								receptor: {
									...this.state.receptor,
									options: resp.data["receptorOptions"],
								},
								isFetchingData: false,
								currentPageNumber: 1,
							})
						)
						.catch((_) => browserHistory.push(ROUTES.Error.push()))
			);
		} else if (whichOption.receptor) {
			this.setState(
				{
					isFetchingData: true,
				},
				() =>
					requestScores(this.state.ligand.filteredList, listOptions)
						.then((resp) =>
							this.setState({
								scoreData: resp.data["scoreData"],
								ligand: {
									...this.state.ligand,
									options: resp.data["ligandOptions"],
								},
								receptor: {
									...this.state.receptor,
									options: resp.data["receptorOptions"],
									filteredOptions: filteredOptions,
									filteredList: listOptions,
								},
								isFetchingData: false,
								currentPageNumber: 1,
							})
						)
						.catch((_) => browserHistory.push(ROUTES.Error.push()))
			);
		} else if (whichOption.interaction) {
			this.setState({
				interaction: {
					...this.state.interaction,
					options: options,
					filteredOptions: filteredOptions,
					filteredList:
						filteredOptions.length === 0
							? this.state.interaction.options.map(
									(option) => option.value
							  )
							: listOptions,
				},
			});
		} else {
			this.setState({
				tumor: {
					...this.state.tumor,
					options: options,
					filteredOptions: filteredOptions,
					filteredList:
						filteredOptions.length === 0
							? this.state.tumor.options.map(
									(option) => option.value
							  )
							: listOptions,
				},
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
						<ColumnBrowserGroup
							{...this.state}
							handleFilter={this.handleFilter}
						/>
					</GridColumn>
				</Grid.Row>

				{this.state.scoreData.length !== 0 &&
					!this.state.isFetchingData && (
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
										listInteraction={
											this.state.interaction.filteredList
										}
										listTumor={
											this.state.tumor.filteredList
										}
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
