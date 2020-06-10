import React from "react";
import { Container, Pagination, PaginationProps } from "semantic-ui-react";

const CardsPerPage: number = 12;

export const calculatePaginationItems = (pageNumber: number) => ({
	start: CardsPerPage * (pageNumber - 1),
	end: CardsPerPage * pageNumber,
});

interface Props {
	totalItems: number;
	handleOnPageChange: (activePageNumber: number) => void;
}

export const AppPagination = ({ totalItems, handleOnPageChange }: Props) => (
	<Container textAlign="center">
		<Pagination
			className="pagination"
			pointing
			secondary
			defaultActivePage={1}
			totalPages={Math.max(Math.ceil(totalItems / CardsPerPage), 1)}
			onPageChange={(
				_: React.SyntheticEvent,
				{ activePage }: PaginationProps
			) => handleOnPageChange(activePage as number)}
		/>
	</Container>
);
