import React from "react";
import { Grid, Icon } from "semantic-ui-react";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import { Navbar } from "../containers/navbar";

import { browserHistory } from "../../utils/browserHistory";
import { ROUTES } from "../../utils/routes";

interface State {
	currentRoute: string;
}

const LazyImportedHomePage = React.lazy(() => import("./pageHome"));
const LazyImportedExpressionPage = React.lazy(() => import("./pageExpression"));
const LazyImportedErrorPage = React.lazy(() => import("./pageError"));
const LazyImportedAboutPage = React.lazy(() => import("./pageAbout"));

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
			<React.StrictMode>
				<React.Suspense fallback={<Icon loading name="spinner" />}>
					<Grid stackable>
						<Navbar {...this.state} />
						<Router history={browserHistory}>
							<Switch>
								<Route
									exact
									path={ROUTES.About.routes}
									component={LazyImportedAboutPage}
								/>
								<Route
									exact
									path={ROUTES.Error.routes}
									component={LazyImportedErrorPage}
								/>
								<Route
									exact
									path={ROUTES.Expression.routes}
									render={(props) => (
										<LazyImportedExpressionPage
											{...props}
										/>
									)}
								/>
								<Route
									exact
									path={ROUTES.Home.routes}
									component={LazyImportedHomePage}
								/>
								<Redirect from="*" to={ROUTES.Home.push()} />
							</Switch>
						</Router>
					</Grid>
				</React.Suspense>
			</React.StrictMode>
		);
	}
}
