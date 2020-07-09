import React from "react";
import { Container, Pagination, PaginationProps } from "semantic-ui-react";

const CardsPerPage: number = 12;

export const calculatePaginationItems = (pageNumber: number) => ({
	start: CardsPerPage * (pageNumber - 1),
	end: CardsPerPage * pageNumber,
});

interface Props {
	totalItems: number;
	currentPageNumber: number;
	handleOnPageChange: (activePageNumber: number) => void;
}

export const AppPagination = ({
	totalItems,
	currentPageNumber,
	handleOnPageChange,
}: Props) => (
	<Container textAlign="center">
		<Pagination
			className="pagination"
			pointing
			secondary
			activePage={currentPageNumber}
			totalPages={Math.max(Math.ceil(totalItems / CardsPerPage), 1)}
			onPageChange={(
				_: React.SyntheticEvent,
				{ activePage }: PaginationProps
			) => handleOnPageChange(activePage as number)}
		/>
	</Container>
);
