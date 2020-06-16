/**
 * external imports
 */
import React from "react";
import Tour from "reactour";

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
	ItemIsPresentType,
} from "../../../utils/backendRequests";
import { TourSteps } from "../../../utils/steps";
import { Banner } from "./banner";
import { ExampleQueryParams } from "../../../utils/constants";

interface State {
	filters: FilterMetadata[];
	itemIsPresent: ItemIsPresentType[];
	scoreData: HeatmapCardType[];
	loading: boolean;
	isFetching: boolean[];
	startTour: boolean;
	resetLoading: boolean;
}

export class HomePage extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			filters: [],
			itemIsPresent: [],
			scoreData: [],
			loading: true,
			isFetching: [],
			startTour: false,
			resetLoading: false,
		};
	}

	/**
	 * on mount get options and data
	 */
	async componentDidMount() {
		await requestCheckboxOptionsAndScores((data1, data2, data3) =>
			this.setState({
				...this.state,
				filters: data1,
				scoreData: data2,
				itemIsPresent: data3,
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
		selectedOptionIndex: number
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
				...filteredOptions.slice(0, selectedOptionIndex),
				...filteredOptions.slice(selectedOptionIndex + 1),
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
			async () =>
				await requestScores(apiArgs, (data1, data2) =>
					this.setState({
						...this.state,
						scoreData: data1,
						itemIsPresent: data2,
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
	handleFilterReset = (filterIndex: number): void => {
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
			async () =>
				await requestScores(apiArgs, (data1, data2) =>
					this.setState({
						...this.state,
						scoreData: data1,
						itemIsPresent: data2,
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

	handleExampleQuery = () => {
		let tmpFilters: FilterMetadata[] = [];
		this.state.filters.forEach(
			({ options, filteredOptions }, filterIndex) => {
				filteredOptions = [];
				options = options.map((option) => {
					if (ExampleQueryParams.includes(option.value)) {
						filteredOptions.push({ ...option, isChecked: true });
						return { ...option, isChecked: true };
					} else {
						return { ...option, isChecked: false };
					}
				});

				tmpFilters.push({
					...this.state.filters[filterIndex],
					options: options,
					filteredOptions: filteredOptions,
				});
			}
		);

		let apiArgs = tmpFilters.map((filter) =>
			filter.filteredOptions.map((option) => option.value)
		);

		this.setState(
			{
				isFetching: this.state.isFetching.map(() => true),
				loading: true,
			},
			async () =>
				await requestScores(apiArgs, (data1, data2) =>
					this.setState({
						...this.state,
						scoreData: data1,
						itemIsPresent: data2,
						filters: tmpFilters,
						isFetching: this.state.isFetching.map(() => false),
						loading: false,
					})
				)
		);
	};

	render() {
		return this.state.filters.length !== 0 ? (
			<>
				<Tour
					steps={TourSteps}
					startAt={0}
					rounded={3}
					updateDelay={0.2}
					lastStepNextButton="End tour"
					isOpen={this.state.startTour}
					onRequestClose={() => this.setState({ startTour: false })}
				/>
				<Grid.Row centered>
					<GridColumn>
						<Banner
							loading={this.state.loading}
							handleExampleQuery={this.handleExampleQuery}
							handleTourToggle={() =>
								this.setState({
									startTour: !this.state.startTour,
								})
							}
						/>
					</GridColumn>
				</Grid.Row>
				<Grid.Row centered>
					<GridColumn>
						<Card.Group data-tour="filter" centered>
							{this.state.filters.map((filter, index) => (
								<ColumnBrowser
									{...filter}
									itemIsPresent={
										this.state.itemIsPresent[index]
											.itemIsPresent
									}
									key={index}
									loading={this.state.isFetching[index]}
									handleToggleCheckbox={
										this.handleToggleCheckbox
									}
									handleReset={this.handleFilterReset}
								/>
							))}
						</Card.Group>
					</GridColumn>
				</Grid.Row>
				{!this.state.loading && <DataDisplayGrid {...this.state} />}
			</>
		) : (
			<Dimmer inverted active page>
				<Loader size="huge" />
			</Dimmer>
		);
	}
}
