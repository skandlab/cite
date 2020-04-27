import React from "react";
import { Grid } from "semantic-ui-react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { Navbar } from "../styled/navbar";
import { Home } from "./pageHome";
import { ErrorPage } from "./pageError";

import {
	ROUTE_HOME,
	//   ROUTE_HEATMAP_IMAGE,
	ROUTE_ERROR,
	//   ROUTE_PATHWAY_SEARCH,
	//   ROUTE_TEAM,
	//   ROUTE_HEATMAP,
	//   ROUTE_HEATMAP_CMP,
	//   ROUTE_PATHWAY_SEARCH_IMAGE,
} from "../../utils/constants";
import { browserHistory } from "../../utils/browser_history";
// import { HeatMapPage } from "./pageHeatmap";
// import { SearchPage } from "./pageSearch";
// import { PageTeam } from "./pageTeam";

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
						<Route exact path={ROUTE_HOME} component={Home} />
						<Route exact path={ROUTE_ERROR} component={ErrorPage} />
						{/* <Route exact path={[ROUTE_HEATMAP_IMAGE, ROUTE_HEATMAP_CMP]} component={HeatMapPage} />
        <Redirect exact from={ROUTE_HEATMAP} to={ROUTE_HEATMAP + "/cs"} />
        <Route exact path={[ROUTE_PATHWAY_SEARCH, ROUTE_PATHWAY_SEARCH_IMAGE]} component={SearchPage} />
        <Route exact path={ROUTE_TEAM} component={PageTeam} /> */}
						<Redirect from="*" to="/ui" />
					</Switch>
				</Router>
			</Grid>
		);
	}
}
