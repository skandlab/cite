import React from "react";
import styled from "@emotion/styled";
import { Grid, GridColumnProps } from "semantic-ui-react";

export const GridColumn: React.FunctionComponent<GridColumnProps> = (props) => (
	<MaxWidthGrid
		mobile={16}
		tablet={16}
		computer={16}
		largeScreen={16}
		widescreen={14}
		{...props}
	>
		{props.children}
	</MaxWidthGrid>
);

const MaxWidthGrid = styled(Grid.Column)`
	max-width: 1500px;
`;
