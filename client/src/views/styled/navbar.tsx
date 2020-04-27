import React from "react";
import { Menu, Grid, Image } from "semantic-ui-react";
import { URL_NAVBAR_LOGO, ROUTE_HOME, APP_TITLE } from "../../utils/constants";
import { browserHistory } from "../../utils/browser_history";
import { GridColumn } from "./gridColumn";

interface Props {
	currentUrl: string;
}

export const Navbar = (_: Props) => (
	<Grid.Row centered className="menuRow">
		<GridColumn>
			<Menu fluid borderless>
				<Menu.Item>
					<Image
						size="mini"
						src={URL_NAVBAR_LOGO}
						alt={APP_TITLE + "-logo"}
						onClick={() => browserHistory.push(ROUTE_HOME)}
					/>
				</Menu.Item>
				<Menu.Item>
					<Menu.Header as="h2">{APP_TITLE}</Menu.Header>
				</Menu.Item>
			</Menu>
		</GridColumn>
	</Grid.Row>
);
