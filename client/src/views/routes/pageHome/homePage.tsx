/**
 * external imports
 */
import React from "react";
import styled from "@emotion/styled";

/**
 * ui elements
 */
import { Grid, Card, Dimmer, Loader } from "semantic-ui-react";
import { GridColumn } from "../../containers/gridColumn";
import { ColumnBrowser } from "../../hoc/columnBrowser";
import { ColumnBrowserType } from "../../hoc/columnBrowser";
import { DataDisplayGrid } from "./dataDisplayGrid";

/**
 * utils
 */
import {
	requestScores,
	requestCheckboxOptionsAndScores,
	HeatmapCardType,
	FilterMetadata,
} from "../../../utils/backendRequests";

interface State {
	filters: FilterMetadata[];
	scoreData: HeatmapCardType[];
	loading: boolean;
	isFetching: boolean[];
}

export class HomePage extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			filters: [],
			scoreData: [],
			loading: true,
			isFetching: [],
		};
	}

	/**
	 * on mount get options and data
	 */
	componentDidMount() {
		requestCheckboxOptionsAndScores((data1, data2) =>
			this.setState({
				...this.state,
				filters: data1,
				scoreData: data2,
				loading: false,
				isFetching: data1.map((_d) => false),
			})
		);
	}

	/**
	 * onToggle
	 */
	handleToggleCheckbox = (
		filterIndex: number,
		selectedOption: ColumnBrowserType,
		selectedfilterIndex: number
	) => {
		let { options, filteredOptions } = this.state.filters[filterIndex];

		/**
		 * create future state
		 */
		options[selectedOption.index] = selectedOption;
		if (selectedOption.isChecked) {
			filteredOptions.push(selectedOption);
		} else {
			filteredOptions = [
				...filteredOptions.slice(0, selectedfilterIndex),
				...filteredOptions.slice(selectedfilterIndex + 1),
			];
		}

		let tmpFilterState = [
			...this.state.filters.slice(0, filterIndex),
			{
				...this.state.filters[filterIndex],
				options: options,
				filteredOptions: filteredOptions,
			},
			...this.state.filters.slice(filterIndex + 1),
		];

		let apiArgs = tmpFilterState.map((filter) =>
			filter.filteredOptions.map((option) => option.value)
		);

		this.setState(
			{
				...this.state,
				isFetching: [
					...this.state.isFetching.slice(0, filterIndex),
					true,
					...this.state.isFetching.slice(filterIndex + 1),
				],
			},
			() =>
				requestScores(apiArgs, (data) =>
					this.setState({
						...this.state,
						scoreData: data,
						filters: tmpFilterState,
						isFetching: [
							...this.state.isFetching.slice(0, filterIndex),
							false,
							...this.state.isFetching.slice(filterIndex + 1),
						],
					})
				)
		);
	};

	/**
	 * reset
	 */
	handleReset = (filterIndex: number): void => {
		let { options, filteredOptions } = this.state.filters[filterIndex];

		filteredOptions.forEach(({ index }) => {
			options[index].isChecked = false;
		});
		filteredOptions = [];

		let tmpFilterState = [
			...this.state.filters.slice(0, filterIndex),
			{
				...this.state.filters[filterIndex],
				options: options,
				filteredOptions: filteredOptions,
			},
			...this.state.filters.slice(filterIndex + 1),
		];

		let apiArgs = tmpFilterState.map((filter) =>
			filter.filteredOptions.map((option) => option.value)
		);

		this.setState(
			{
				...this.state,
				isFetching: [
					...this.state.isFetching.slice(0, filterIndex),
					true,
					...this.state.isFetching.slice(filterIndex + 1),
				],
			},
			() =>
				requestScores(apiArgs, (data) =>
					this.setState({
						...this.state,
						scoreData: data,
						filters: tmpFilterState,
						isFetching: [
							...this.state.isFetching.slice(0, filterIndex),
							false,
							...this.state.isFetching.slice(filterIndex + 1),
						],
					})
				)
		);
	};

	render() {
		return this.state.filters.length !== 0 ? (
			<>
				<Grid.Row centered>
					<GridColumn>
						<Card.Group centered>
							{this.state.filters.map((filter, filterIndex) => (
								<ColumnBrowser
									{...filter}
									key={filter.index}
									loading={this.state.isFetching[filterIndex]}
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
					<LoaderText>
						<p>Loading...</p>
					</LoaderText>
				)}
			</>
		) : (
			<Dimmer inverted active page>
				<Loader size="huge" />
			</Dimmer>
		);
	}
}

const LoaderText = styled.span`
	position: absolute;
	bottom: 0;
`;
