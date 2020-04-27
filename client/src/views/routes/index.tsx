import React from "react";
import { Grid } from "semantic-ui-react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { Navbar } from "../styled/navbar";
import { Home } from "./pageHome";
import { ErrorPage } from "./pageError";
import { PageTeam } from "./pageTeam";

import { ROUTES } from "../../utils/constants";
import { browserHistory } from "../../utils/browser_history";

interface State {
	currentUrl: string;
}

export class AppRouter extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			currentUrl: window.location.pathname,
		};
	}

	componentDidMount() {
		//@ts-ignore
		this.unlisten = browserHistory.listen((location) => {
			this.setState({ currentUrl: location.pathname });
		});
	}

	componentWillUnmount() {
		//@ts-ignore
		this.unlisten();
	}

	render() {
		return (
			<Grid stackable>
				<Navbar {...this.state} />
				<Router history={browserHistory}>
					<Switch>
						<Route
							exact
							path={ROUTES.Home.route}
							component={Home}
						/>
						<Route
							exact
							path={ROUTES.Team.route}
							component={PageTeam}
						/>
						<Route
							exact
							path={ROUTES.Error.route}
							component={ErrorPage}
						/>

						<Redirect from="*" to="/ui" />
					</Switch>
				</Router>
			</Grid>
		);
	}
}
