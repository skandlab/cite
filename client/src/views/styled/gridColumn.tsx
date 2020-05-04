import React from "react";
import { Grid, GridColumnProps } from "semantic-ui-react";

export const GridColumn: React.FunctionComponent<GridColumnProps> = (props) => (
	<Grid.Column
		mobile={16}
		tablet={16}
		computer={16}
		largeScreen={16}
		widescreen={14}
		{...props}
	>
		{props.children}
	</Grid.Column>
);
