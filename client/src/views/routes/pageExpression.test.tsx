import React from "react";
import "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor } from "@testing-library/react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { ExpressionPage } from "./pageExpression";
import { ROUTES } from "../../utils/routes";

describe("snapshot tests", () => {
	test("A2M EGFR", async () => {
		const history = createMemoryHistory();
		history.push(["/ui/expression", "A2M", "EGFR", "BLCA"].join("/"));

		const { asFragment } = await render(
			<Router history={history}>
				<Route
					exact
					path={ROUTES.Expression.routes}
					component={ExpressionPage}
				/>
			</Router>
		);

		await screen.findAllByText("Bladder Urothelial Carcinoma");
		expect(
			screen.getAllByText("Bladder Urothelial Carcinoma")
		).toHaveLength(2);

		/**
		 * cant match snapshot as _echarts_instance_ property is dynamic in nature
		 *
		 * also since echarts is an external library, its ok
		 */
	});
});
