import React from "react";
import { Grid, GridColumnProps } from "semantic-ui-react";

export const GridColumn: React.FunctionComponent<GridColumnProps> = (props) => (
  <Grid.Column mobile={15} tablet={15} computer={14} largeScreen={12} widescreen={12} {...props}>
    {props.children}
  </Grid.Column>
);
