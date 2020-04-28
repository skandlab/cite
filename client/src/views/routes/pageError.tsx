import React from "react";
import { Grid, Header, Icon, Button } from "semantic-ui-react";
import { browserHistory } from "../../utils/browser_history";
import { GridColumn } from "../styled/gridColumn";
import { Members, ROUTES } from "../../utils/constants";

export const ErrorPage = () => (
	<Grid.Row centered>
		<GridColumn textAlign="center">
			<Grid.Row>
				<Header as="h2" icon>
					<Icon name="exclamation circle" color="red" />
					Something went wrong in our servers
					<Header.Subheader>
						Feel free to contact us if the problem persists.
					</Header.Subheader>
				</Header>
			</Grid.Row>
			<Grid.Row>
				<Button.Group>
					<Button
						onClick={() => browserHistory.push(ROUTES.Home.route)}
					>
						Back to home
					</Button>
					<Button
						as="a"
						secondary
						href={"mailto:" + Members[0].email}
						target="_blank"
						rel="noopener noreferrer"
					>
						Send an email
					</Button>
				</Button.Group>
			</Grid.Row>
		</GridColumn>
	</Grid.Row>
);
