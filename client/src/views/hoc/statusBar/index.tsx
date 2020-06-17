import React from "react";
import styled from "@emotion/styled";
import { Segment } from "semantic-ui-react";
import { ColorBar } from "./colorbar";
import { Summary } from "./summary";

interface Props {
	totalItems: number;
	currentPageNumber: number;
}

export const StatusBar = (props: Props) => (
	<StackableStatusBar>
		<Summary {...props} />
		<ColorBar />
	</StackableStatusBar>
);

export const StatusBarSegment = styled(Segment)`
	margin: 1em auto !important;
`;

const StackableStatusBar = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 0 3em;
	flex-wrap: wrap;
`;
