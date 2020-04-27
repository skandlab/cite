import React from "react";
import { Grid, Dimmer, Loader } from "semantic-ui-react";
import { API_DATA, API_METADATA, ROUTE_ERROR } from "../../../utils/constants";
import axios from "axios";
import { ColumnBrowserProps } from "./columnBrowser/columnBrowser";
import { HeatMapCards } from "./heatmapCards";
import { ColumnBrowserGroup } from "./columnBrowser/columnBrowserGroup";
import { StatusBar } from "./statusBar/statusBar";
import { AppPagination, paginationData } from "./pagination";
import { GridColumn } from "../../styled/gridColumn";
import { browserHistory } from "../../../utils/browser_history";

export interface InterfaceData {
	ligand: string;
	receptor: string;
	values: {
		tumor_type: string;
		[key: string]: string;
	}[];
}

interface State {
	unfilteredData: InterfaceData[];
	filteredData: InterfaceData[];
	ligandOptions: ColumnBrowserProps[];
	receptorOptions: ColumnBrowserProps[];
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
			receptorOptions: [],
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
					unfilteredData: resp[0].data,
					filteredData: resp[0].data,
					ligandOptions: resp[1].data["ligandOptions"],
					receptorOptions: resp[1].data["receptorOptions"],
					tumorOptions: resp[1].data["tumorOptions"],
					pairsOptions: resp[1].data["pairsOptions"],
					isFetchingData: false,
				})
			)
			.catch((_) => browserHistory.push(ROUTE_ERROR))
			.finally(() => this.setState({ isFetchingData: false }));
	}

	updateLigandOrReceptor = (
		_ligandOptions: ColumnBrowserProps[],
		_receptorOptions: ColumnBrowserProps[]
	) => {
		let _tmpLigandList = grepValueFromOption(_ligandOptions);
		let _tmpReceptorList = grepValueFromOption(_receptorOptions);
		if (
			_tmpLigandList.length === 0 &&
			_tmpReceptorList.length === 0 &&
			this.state.filteredData.length !== this.state.unfilteredData.length // first mount case
		) {
			this.setState({
				filteredData: this.state.unfilteredData,
				ligandOptions: _ligandOptions,
				receptorOptions: _receptorOptions,
			});
		} else {
			this.setState({ isFetchingData: true }, () =>
				requestData(_tmpLigandList, _tmpReceptorList)
					.then((resp) =>
						this.setState({
							filteredData: resp.data,
							isFetchingData: false,
							ligandOptions: _ligandOptions,
							receptorOptions: _receptorOptions,
						})
					)
					.catch((_) => browserHistory.push(ROUTE_ERROR))
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

				{this.state.filteredData.length !== 0 &&
					!this.state.isFetchingData && (
						<>
							<Grid.Row centered>
								<GridColumn>
									<StatusBar {...this.state} />
								</GridColumn>
							</Grid.Row>
							<Grid.Row />
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
