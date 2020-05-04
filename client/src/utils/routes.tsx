const ROUTE_PREFIX = "/ui";

const ROUTE_HOME = ROUTE_PREFIX;
const ROUTE_TEAM = ROUTE_PREFIX + "/team";
const ROUTE_ERROR = ROUTE_PREFIX + "/error";

export const ROUTES = {
	Home: {
		name: "Home",
		show: true,
		routes: [ROUTE_HOME],
		push: () => ROUTE_HOME.replace(/\/+$/, ""),
		match: (currentRoute: string) =>
			currentRoute.replace(/\/+$/, "") === ROUTE_HOME,
	},
	Team: {
		name: "Team",
		show: true,
		routes: [ROUTE_TEAM],
		push: () => ROUTE_TEAM.replace(/\/+$/, ""),
		match: (currentRoute: string) =>
			currentRoute.replace(/\/+$/, "").startsWith(ROUTE_TEAM),
	},
	Error: {
		name: "Error",
		show: false,
		routes: [ROUTE_ERROR],
		push: () => ROUTE_ERROR.replace(/\/+$/, ""),
		match: (currentRoute: string) =>
			currentRoute.replace(/\/+$/, "").startsWith(ROUTE_ERROR),
	},
};

export const ROUTES_ARRAY = Object.values(ROUTES);
