import React from "react";
import styled from "@emotion/styled";
import { Statistic } from "semantic-ui-react";
import { calculatePaginationItems } from "../pagination";
import { StatusBarSegment } from ".";

interface Props {
	totalItems: number;
	currentPageNumber: number;
}

export const Summary = ({ totalItems, currentPageNumber }: Props) => {
	let { start, end } = calculatePaginationItems(currentPageNumber);
	end = Math.min(end, totalItems);
	start = totalItems === 0 ? 0 : start + 1;

	return (
		<StatusBarSegment data-tour="summary" compact>
			<StyledStatisticGroup>
				<Statistic
					label={<small>Total</small>}
					value={totalItems}
					size="mini"
				/>
				<Statistic
					label={<small>Showing</small>}
					value={start + "-" + end}
					size="mini"
				/>
			</StyledStatisticGroup>
			<label>Ligand-Receptor Combinations</label>
		</StatusBarSegment>
	);
};

const StyledStatisticGroup = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
`;
