import React from "react";
import { Menu, Grid, Image } from "semantic-ui-react";
import {
	APP_TITLE,
	URL_NAVBAR_LOGO,
	ROUTES_ARRAY,
	ROUTES,
} from "../../utils/constants";
import { browserHistory } from "../../utils/browser_history";
import { GridColumn } from "./gridColumn";

interface Props {
	currentUrl: string;
}

export const Navbar = (props: Props) => {
	return (
		<>
			<Grid.Row centered>
				<GridColumn>
					<Menu fluid borderless>
						<Menu.Item>
							<Image
								size="mini"
								src={URL_NAVBAR_LOGO}
								alt={APP_TITLE + "-logo"}
								onClick={() =>
									browserHistory.push(ROUTES.Home.route)
								}
							/>
						</Menu.Item>
						<Menu.Item>
							<Menu.Header as="h2">{APP_TITLE}</Menu.Header>
						</Menu.Item>
						<Menu.Menu position="right">
							{ROUTES_ARRAY.filter((val) => val.show).map(
								(val) => (
									<Menu.Item
										key={val.name}
										name={val.name}
										active={val.matches(props.currentUrl)}
										onClick={() =>
											browserHistory.push(val.route)
										}
									/>
								)
							)}
						</Menu.Menu>
					</Menu>
				</GridColumn>
			</Grid.Row>
			<Grid.Row />
		</>
	);
};
