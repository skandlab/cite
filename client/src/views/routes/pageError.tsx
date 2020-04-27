import React from "react";
import { Grid, Header, Icon, Button } from "semantic-ui-react";
import { browserHistory } from "../../utils/browser_history";
import { GridColumn } from "../styled/gridColumn";
import { Members } from "../../utils/constants";

export const ErrorPage = () => (
	<Grid.Row className="errorpage" centered>
		<GridColumn textAlign="center">
			<Grid.Row>
				<Header as="h2" icon>
					<Icon name="exclamation circle" color="red" />
					Something went wrong in our servers
					<Header.Subheader color="red">
						Feel free to contact us if the problem persists.
					</Header.Subheader>
				</Header>
			</Grid.Row>
			<Grid.Row>
				<Button.Group>
					<Button
						color="black"
						onClick={() => browserHistory.push("/")}
					>
						Back to home
					</Button>
					<Button
						as="a"
						color="green"
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
