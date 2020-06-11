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
}

export class HomePage extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			filters: [],
			scoreData: [],
			loading: true,
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
			})
		);
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
			requestScores(apiArgs, (data) =>
				this.setState({
					...this.state,
					scoreData: data,
					loading: false,
					filters: tmpFilterState,
				})
			)
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
			requestScores(apiArgs, (data) =>
				this.setState({
					...this.state,
					scoreData: data,
					loading: false,
					filters: tmpFilterState,
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
