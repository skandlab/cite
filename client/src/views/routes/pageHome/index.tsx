import React from "react";
import { Grid, Dimmer, Loader } from "semantic-ui-react";
import { API_DATA, API_METADATA, ROUTES } from "../../../utils/constants";
import axios from "axios";
import { ColumnBrowserProps } from "./columnBrowser/columnBrowser";
import { HeatMapCards } from "./heatmapCards";
import { ColumnBrowserGroup } from "./columnBrowser/columnBrowserGroup";
import { StatusBar } from "./statusBar/statusBar";
import { AppPagination, paginationData } from "./pagination";
import { GridColumn } from "../../styled/gridColumn";
import { browserHistory } from "../../../utils/browser_history";
import { InterfaceData } from "../../../utils/interfaces";

interface State {
	filteredData: InterfaceData[];
	unfilteredData: InterfaceData[];
	ligandOptions: ColumnBrowserProps[];
	unfilteredLigandOptions: ColumnBrowserProps[];
	receptorOptions: ColumnBrowserProps[];
	unfilteredReceptorOptions: ColumnBrowserProps[];
	tumorOptions: ColumnBrowserProps[];
	pairsOptions: ColumnBrowserProps[];
	isFetchingData: boolean;
	currentPageNumber: number;
}

const requestData = (list_ligand: string[], list_receptor: string[]) =>
	axios.request({ method: "GET", url: API_DATA(list_ligand, list_receptor) });
const requestMetadata = () =>
	axios.request({ method: "GET", url: API_METADATA() });

const grepValueFromOption = (options: ColumnBrowserProps[]) =>
	options.filter((option) => option.isChecked).map((option) => option.value);

export class Home extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			unfilteredData: [],
			filteredData: [],
			ligandOptions: [],
			unfilteredLigandOptions: [],
			receptorOptions: [],
			unfilteredReceptorOptions: [],
			tumorOptions: [],
			pairsOptions: [],
			isFetchingData: false,
			currentPageNumber: 1,
		};
	}

	componentDidMount() {
		this.setState({ isFetchingData: true });
		axios
			.all([requestData([], []), requestMetadata()])
			.then((resp) =>
				this.setState({
					unfilteredData: resp[0].data["filteredData"],
					filteredData: resp[0].data["filteredData"],
					ligandOptions: resp[0].data["ligandOptions"],
					unfilteredLigandOptions: resp[0].data["ligandOptions"],
					receptorOptions: resp[0].data["receptorOptions"],
					unfilteredReceptorOptions: resp[0].data["receptorOptions"],
					tumorOptions: resp[1].data["tumorOptions"],
					pairsOptions: resp[1].data["pairsOptions"],
					isFetchingData: false,
				})
			)
			.catch((_) => browserHistory.push(ROUTES.Error.route))
			.finally(() => this.setState({ isFetchingData: false }));
	}

	updateLigandOrReceptor = (
		ligandOptions: ColumnBrowserProps[],
		receptorOptions: ColumnBrowserProps[],
		updateIsLigand: boolean
	) => {
		let ligandList = grepValueFromOption(ligandOptions);
		let receptorList = grepValueFromOption(receptorOptions);

		// if no filtered ligand and no filtered receptor
		// and filteredData is not same as unfilteredData
		if (
			ligandList.length === 0 &&
			receptorList.length === 0 &&
			this.state.filteredData.length !== this.state.unfilteredData.length // first mount case
		) {
			this.setState({
				filteredData: this.state.unfilteredData,
				ligandOptions: updateIsLigand
					? ligandOptions
					: this.state.unfilteredLigandOptions,
				receptorOptions: updateIsLigand
					? this.state.unfilteredReceptorOptions
					: receptorOptions,
				currentPageNumber: 1,
			});
		} else {
			this.setState({ isFetchingData: true }, () =>
				requestData(ligandList, receptorList)
					.then((resp) =>
						this.setState({
							filteredData: resp.data["filteredData"],
							isFetchingData: false,
							ligandOptions: updateIsLigand
								? ligandOptions
								: resp.data["ligandOptions"],
							receptorOptions: updateIsLigand
								? resp.data["receptorOptions"]
								: receptorOptions,
							currentPageNumber: 1,
						})
					)
					.catch((_) => browserHistory.push(ROUTES.Error.route))
					.finally(() => this.setState({ isFetchingData: false }))
			);
		}
	};

	render() {
		return this.state.ligandOptions.length !== 0 ? (
			<>
				<Grid.Row centered>
					<GridColumn>
						<ColumnBrowserGroup
							{...this.state}
							{...this}
							updateTumorOptions={(value) =>
								this.setState({ tumorOptions: value })
							}
							updatePairsOptions={(value) =>
								this.setState({ pairsOptions: value })
							}
						/>
					</GridColumn>
				</Grid.Row>

				<Grid.Row centered>
					<GridColumn>
						<StatusBar {...this.state} />
					</GridColumn>
				</Grid.Row>
				<Grid.Row />

				{this.state.filteredData.length !== 0 &&
					!this.state.isFetchingData && (
						<>
							<Grid.Row centered>
								<GridColumn>
									<HeatMapCards
										data={paginationData({ ...this.state })}
										{...this.state}
									/>
								</GridColumn>
							</Grid.Row>
							<Grid.Row centered>
								<GridColumn>
									<AppPagination
										{...this.state}
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
		) : (
			<Dimmer active inverted page>
				<Loader size="huge" />
			</Dimmer>
		);
	}
}
