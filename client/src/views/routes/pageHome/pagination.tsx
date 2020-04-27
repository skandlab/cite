import React from "react";
import { Container, Pagination } from "semantic-ui-react";
import { InterfaceData } from ".";

const CardsPerPage: number = 12;

export function calculatePaginationItems(pageNumber: number) {
	return {
		start: CardsPerPage * (pageNumber - 1) + 1,
		end: CardsPerPage * pageNumber,
	};
}

export function paginationData(props: {
	filteredData: InterfaceData[];
	currentPageNumber: number;
}) {
	let { start, end } = calculatePaginationItems(props.currentPageNumber);
	return props.filteredData.slice(start - 1, end);
}

export function paginationText(props: {
	currentPageNumber: number;
	totalItems: number;
}) {
	let { start, end } = calculatePaginationItems(props.currentPageNumber);
	end = Math.min(end, props.totalItems);
	return { start: start, end: end };
}

interface Props {
	filteredData: InterfaceData[];
	currentPageNumber: number;
	handleOnPageChange: (activePageNumber: number) => void;
}

export const AppPagination = (props: Props) => (
	<Container textAlign="center">
		<Pagination
			className="pagination"
			pointing
			secondary
			defaultActivePage={1}
			totalPages={Math.ceil(props.filteredData.length / CardsPerPage)}
			onPageChange={(_, { activePage }) =>
				props.handleOnPageChange(activePage as number)
			}
		/>
	</Container>
);
