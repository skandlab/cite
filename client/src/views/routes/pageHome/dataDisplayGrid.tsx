import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { GridColumn } from "../../containers/gridColumn";
import { StatusBar } from "../../hoc/statusBar";
import { HeatMapCardGroup } from "../../hoc/heatmapCards/heatmapCards";
import { AppPagination, calculatePaginationItems } from "../../hoc/pagination";
import { HeatmapCardType } from "../../../utils/backendRequests";

interface Props {
	scoreData: HeatmapCardType[];
}

export const DataDisplayGrid = ({ scoreData }: Props) => {
	const [currentPageNumber, updateCurrentPageNumber] = useState(1);

	useEffect(() => {
		updateCurrentPageNumber(1);
	}, [scoreData]);

	let { start, end } = calculatePaginationItems(currentPageNumber);

	return (
		<>
			<Grid.Row centered>
				<GridColumn>
					<StatusBar
						totalItems={scoreData.length}
						currentPageNumber={currentPageNumber}
					/>
				</GridColumn>
			</Grid.Row>

			<Grid.Row />

			<Grid.Row centered>
				<GridColumn>
					<HeatMapCardGroup
						scoreDataList={scoreData.slice(start, end)}
					/>
				</GridColumn>
			</Grid.Row>

			<Grid.Row centered>
				<GridColumn>
					<AppPagination
						totalItems={scoreData.length}
						currentPageNumber={currentPageNumber}
						handleOnPageChange={updateCurrentPageNumber}
					/>
				</GridColumn>
			</Grid.Row>
		</>
	);
};
