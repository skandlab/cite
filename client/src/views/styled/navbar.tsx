import React from "react";
import {
	Grid,
	Menu,
	Header,
	Image,
	Responsive,
	Dropdown,
} from "semantic-ui-react";

import { URL_NAVBAR_LOGO, APP_TITLE } from "../../utils/constants";
import { browserHistory } from "../../utils/browserHistory";
import { ROUTES_ARRAY, ROUTES } from "../../utils/routes";
import { GridColumn } from "./gridColumn";
import styled from "@emotion/styled";

interface Props {
	currentRoute: string;
}

const StyledImageMenuItem = styled(Menu.Item)`
	padding-left: 0 !important;
`;

const CommonMenu = () => (
	<>
		<StyledImageMenuItem>
			<Image
				size="mini"
				src={URL_NAVBAR_LOGO}
				alt="Tumeric-logo"
				onClick={() => browserHistory.push(ROUTES.Home.push())}
			/>
		</StyledImageMenuItem>
		<Menu.Item>
			<Responsive maxWidth={1000}>
				<Header as="h2">
					<b>{APP_TITLE}</b>
				</Header>
			</Responsive>
			<Responsive maxWidth={1200} minWidth={1000}>
				<Header as="h3">
					<b>{APP_TITLE}</b>
				</Header>
			</Responsive>
			<Responsive minWidth={1200}>
				<Header as="h2">
					<b>{APP_TITLE}</b>
				</Header>
			</Responsive>
		</Menu.Item>
	</>
);

const ComputerMenu = (props: { currentRoute: string }) => (
	<Menu fluid borderless>
		<CommonMenu />
		<Menu.Menu position="right">
			{ROUTES_ARRAY.map(
				(val) =>
					val.show && (
						<Menu.Item
							key={val.name}
							name={val.name}
							active={val.match(props.currentRoute)}
							onClick={() => browserHistory.push(val.push())}
						/>
					)
			)}
		</Menu.Menu>
	</Menu>
);

const MobileMenu = (props: { currentRoute: string }) => (
	<Menu fluid borderless>
		<CommonMenu />
		<Menu.Menu position="right">
			<Menu.Item>
				<Dropdown icon="bars">
					<Dropdown.Menu>
						{ROUTES_ARRAY.map(
							(val) =>
								val.show && (
									<Dropdown.Item
										key={val.name}
										text={val.name}
										selected={val.match(props.currentRoute)}
										onClick={() =>
											browserHistory.push(val.push())
										}
									/>
								)
						)}
					</Dropdown.Menu>
				</Dropdown>
			</Menu.Item>
		</Menu.Menu>
	</Menu>
);

export const Navbar = (props: Props) => (
	<Grid.Row centered className="menuRow">
		<GridColumn>
			<Responsive minWidth={Responsive.onlyMobile.maxWidth}>
				<ComputerMenu currentRoute={props.currentRoute} />
			</Responsive>
			<Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
				<MobileMenu currentRoute={props.currentRoute} />
			</Responsive>
		</GridColumn>
	</Grid.Row>
);
