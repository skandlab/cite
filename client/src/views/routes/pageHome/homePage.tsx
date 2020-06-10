/**
 * external imports
 */
import React from "react";

/**
 * ui elements
 */
import { Grid, Card } from "semantic-ui-react";
import { GridColumn } from "../../containers/gridColumn";
import { ColumnBrowser } from "../../hoc/columnBrowser";
import { ColumnBrowserType } from "../../hoc/columnBrowser";
import { DataDisplayGrid } from "./dataDisplayGrid";

/**
 * utils
 */
import {
	requestScores,
	requestCheckboxOptions,
} from "../../../utils/backendRequests";
import { browserHistory } from "../../../utils/browserHistory";

/**
 * interfaces and constants
 */
import { SemanticShorthandContent } from "semantic-ui-react/dist/commonjs/generic";
import { ROUTES } from "../../../utils/routes";
import { HeatmapCardType } from "../../../utils/interfaces";
import styled from "@emotion/styled";

export type FilterMetadata = {
	index: number;
	title: string;
	popupContent: SemanticShorthandContent;
	options: ColumnBrowserType[];
	filteredOptions: ColumnBrowserType[];
};

interface State {
	filters: FilterMetadata[];

	dataPresent: {
		[key: string]: boolean;
	}[];
	scoreData: HeatmapCardType[];

	loading: boolean;
}

export class HomePage extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			filters: [],
			dataPresent: [],
			scoreData: [],
			loading: true,
		};
	}

	/**
	 * on mount get options and data
	 */
	componentDidMount() {
		Promise.all([requestCheckboxOptions(), requestScores([[], [], [], []])])
			.then(async (resp) => {
				const respData1 = await resp[0].json();
				const respData2 = await resp[1].json();
				this.setState({
					...this.state,
					...respData1,
					...respData2,
					loading: false,
				});
			})
			.catch((_) => browserHistory.push(ROUTES.Error.push()));
	}

	/**
	 * onToggle
	 */
	handleToggleCheckbox = (
		index: number,
		selectedOption: ColumnBrowserType,
		selectedIndex: number
	) => {
		let { options, filteredOptions } = this.state.filters[index];

		/**
		 * create future state
		 */
		options[selectedOption.index] = selectedOption;
		if (selectedOption.isChecked) {
			filteredOptions.push(selectedOption);
		} else {
			filteredOptions = [
				...filteredOptions.slice(0, selectedIndex),
				...filteredOptions.slice(selectedIndex + 1),
			];
		}

		let tmpFilterState = [
			...this.state.filters.slice(0, index),
			{
				...this.state.filters[index],
				options: options,
				filteredOptions: filteredOptions,
			},
			...this.state.filters.slice(index + 1),
		];

		let apiArgs = tmpFilterState.map((filter) =>
			filter.filteredOptions.map((option) => option.value)
		);

		this.setState({ loading: true }, () =>
			requestScores(apiArgs)
				.then(async (resp) => {
					const respData = await resp.json();
					this.setState({
						...this.state,
						...respData,
						loading: false,
						filters: tmpFilterState,
					});
				})
				.catch((_) => browserHistory.push(ROUTES.Error.push()))
		);
	};

	/**
	 * reset
	 */
	handleReset = (index: number): void => {
		let { options, filteredOptions } = this.state.filters[index];

		filteredOptions.forEach(({ index }) => {
			options[index].isChecked = false;
		});
		filteredOptions = [];

		let tmpFilterState = [
			...this.state.filters.slice(0, index),
			{
				...this.state.filters[index],
				options: options,
				filteredOptions: filteredOptions,
			},
			...this.state.filters.slice(index + 1),
		];

		let apiArgs = tmpFilterState.map((filter) =>
			filter.filteredOptions.map((option) => option.value)
		);

		this.setState({ loading: true }, () =>
			requestScores(apiArgs)
				.then(async (resp) => {
					const respData = await resp.json();
					this.setState({
						...this.state,
						...respData,
						loading: false,
						filters: tmpFilterState,
					});
				})
				.catch((_) => browserHistory.push(ROUTES.Error.push()))
		);
	};

	// TODO: popupContent
	render() {
		return (
			this.state.filters && (
				<>
					<Grid.Row centered>
						<GridColumn>
							<Card.Group centered>
								{this.state.filters.map((filter) => (
									<ColumnBrowser
										{...filter}
										key={filter.index}
										loading={this.state.loading}
										handleToggleCheckbox={
											this.handleToggleCheckbox
										}
										handleReset={this.handleReset}
									/>
								))}
							</Card.Group>
						</GridColumn>
					</Grid.Row>
					{!this.state.loading && <DataDisplayGrid {...this.state} />}
					{this.state.loading && (
						<Loader>
							<p>Loading...</p>
						</Loader>
					)}
				</>
			)
		);
	}
}

const Loader = styled.span`
	position: absolute;
	bottom: 0;
`;
