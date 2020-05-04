import React from "react";
import styled from "@emotion/styled";

import { Grid, Header, Icon, Button, Segment } from "semantic-ui-react";
import { GridColumn } from "../styled/gridColumn";

import { browserHistory } from "../../utils/browserHistory";

import { Members } from "../../utils/constants";
import { ROUTES } from "../../utils/routes";

const ExtraMarginHeader = styled(Header)`
	margin-bottom: 2em !important;
`;

export const ErrorPage = () => (
	<Grid.Row centered>
		<GridColumn textAlign="center">
			<Segment>
				<ExtraMarginHeader as="h2" icon>
					<Icon name="exclamation circle" color="red" />
					Something went wrong in our servers
					<Header.Subheader color="red">
						Feel free to contact us if the problem persists.
					</Header.Subheader>
				</ExtraMarginHeader>
				<br />
				<Segment.Inline>
					<Button
						color="black"
						onClick={() => browserHistory.push(ROUTES.Home.push())}
					>
						Back to home
					</Button>
					<Button
						as="a"
						basic
						href={"mailto:" + Members[0].email}
						target="_blank"
						rel="noopener noreferrer"
					>
						Send an email
					</Button>
				</Segment.Inline>
			</Segment>
		</GridColumn>
	</Grid.Row>
);
