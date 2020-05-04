import React from "react";
import { Grid } from "semantic-ui-react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { Navbar } from "../styled/navbar";
import { HomePage } from "./pageHome";
import { ErrorPage } from "./pageError";
import { PageTeam } from "./pageTeam";

import { browserHistory } from "../../utils/browserHistory";
import { ROUTES } from "../../utils/routes";

interface State {
	currentRoute: string;
}

export class AppRouter extends React.Component<{}, State> {
	constructor(props: {}) {
		super(props);

		this.state = {
			currentRoute: window.location.pathname,
		};
	}

	componentDidMount() {
		//@ts-ignore
		this.unlisten = browserHistory.listen((location) => {
			this.setState({ currentRoute: location.pathname });
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
							path={ROUTES.Team.routes}
							component={PageTeam}
						/>
						<Route
							exact
							path={ROUTES.Error.routes}
							component={ErrorPage}
						/>
						<Route
							exact
							path={ROUTES.Home.routes}
							component={HomePage}
						/>
						<Redirect from="*" to={ROUTES.Home.push()} />
					</Switch>
				</Router>
			</Grid>
		);
	}
}
