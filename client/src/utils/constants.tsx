export const APP_TITLE = "Tumeric";

export const ROUTE_PREFIX = "/ui";
export const ROUTE_HOME = ROUTE_PREFIX + "/";
export const ROUTE_ERROR = ROUTE_PREFIX + "/error";

export const API_URL = "http://localhost:5000/server";
export const API_METADATA = () => API_URL + "/v1/metadata";
export const API_DATA = (list_ligand: string[], list_receptor: string[]) =>
	API_URL +
	"/v1/data?list_ligand=" +
	list_ligand.join(",") +
	"&list_receptor=" +
	list_receptor.join(",") +
	"&list_tumor=" +
	// list_tumor.join(",") +
	"&list_pairs=";
// list_pairs.join(",");

export const URL_NAVBAR_LOGO = require("../assets/logo.svg");

export const Members: {
	imageUrl: string;
	header: string;
	subHeader: string;
	jobDescription: string;
	email: string;
}[] = [
	{
		imageUrl:
			"https://react.semantic-ui.com/images/avatar/large/matthew.png",
		header: "Probhonjon Baruah",
		subHeader: "Joined in 2019",
		jobDescription: "Bioinformatics Specialist",
		email: "baruahp@gis.a-star.edu.sg",
	},
	{
		imageUrl: "https://react.semantic-ui.com/images/avatar/large/molly.png",
		header: "Neha Rohatgi",
		subHeader: "Joined in 2017",
		jobDescription: "Post-Doc",
		email: "rohatgin@gis.a-star.edu.sg",
	},
	{
		imageUrl:
			"https://react.semantic-ui.com/images/avatar/large/daniel.jpg",
		header: "Anders Skanderup",
		subHeader: "Joined in 2015",
		jobDescription: "Principal Investigator",
		email: "skanderupamj@gis.a-star.edu.sg",
	},
];
