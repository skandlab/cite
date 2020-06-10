import React, { useState } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { StatusBar } from "../../hoc/statusBar";
import { HeatMapCardGroup } from "../../hoc/heatmapCards/heatmapCards";
import { AppPagination, calculatePaginationItems } from "../../hoc/pagination";
import { HeatmapCardType } from "../../../utils/interfaces";

interface Props {
	scoreData: HeatmapCardType[];
}

export const DataDisplayGrid = (props: Props) => {
	const [currentPageNumber, updateCurrentPageNumber] = useState(1);

	let { start, end } = calculatePaginationItems(currentPageNumber);

	return (
		<>
			<Grid.Row centered>
				<GridColumn>
					<StatusBar
						totalItems={props.scoreData.length}
						currentPageNumber={currentPageNumber}
					/>
				</GridColumn>
			</Grid.Row>

			<Grid.Row />

			<Grid.Row centered>
				<GridColumn>
					<HeatMapCardGroup
						scoreDataList={props.scoreData.slice(start, end)}
					/>
				</GridColumn>
			</Grid.Row>

			<Grid.Row centered>
				<GridColumn>
					<AppPagination
						{...props}
						totalItems={props.scoreData.length}
						handleOnPageChange={updateCurrentPageNumber}
					/>
				</GridColumn>
			</Grid.Row>
		</>
	);
};
