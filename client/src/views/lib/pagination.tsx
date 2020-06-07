import React from "react";
import { Container, Pagination, PaginationProps } from "semantic-ui-react";

const CardsPerPage: number = 12;

export function calculatePaginationItems(pageNumber: number) {
	return {
		start: CardsPerPage * (pageNumber - 1),
		end: CardsPerPage * pageNumber,
	};
}

interface Props {
	totalItems: number;
	handleOnPageChange: (activePageNumber: number) => void;
}

export const AppPagination = (props: Props) => {
	const onPageChange = (
		_: React.SyntheticEvent,
		{ activePage }: PaginationProps
	) => props.handleOnPageChange(activePage as number);

	const totalPages = Math.max(Math.ceil(props.totalItems / CardsPerPage), 1);

	return (
		<Container textAlign="center">
			<Pagination
				className="pagination"
				pointing
				secondary
				defaultActivePage={1}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</Container>
	);
};
