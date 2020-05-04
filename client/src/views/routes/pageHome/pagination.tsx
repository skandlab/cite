import React from "react";
import { Container, Pagination } from "semantic-ui-react";

const CardsPerPage: number = 12;

export function calculatePaginationItems(pageNumber: number) {
	return {
		start: CardsPerPage * (pageNumber - 1),
		end: CardsPerPage * pageNumber,
	};
}

interface Props {
	totalItems: number;
	currentPageNumber: number;
	handleOnPageChange: (activePageNumber: number) => void;
}

export const AppPagination = (props: Props) => {
	const totalPages = Math.max(Math.ceil(props.totalItems / CardsPerPage), 1);
	return (
		<Container textAlign="center">
			<Pagination
				className="pagination"
				pointing
				secondary
				defaultActivePage={1}
				totalPages={totalPages}
				onPageChange={(_, { activePage }) =>
					props.handleOnPageChange(activePage as number)
				}
			/>
		</Container>
	);
};
