import axios from "axios";

const API_URL = "http://localhost:5000/server";

export const requestScores = (listLigand: string[], listReceptor: string[]) =>
	axios.request({
		method: "GET",
		url:
			API_URL +
			"/v1/scores?ligands=" +
			listLigand.join(",") +
			"&receptors=" +
			listReceptor.join(","),
	});

export const requestCheckboxOptions = () =>
	axios.request({ method: "GET", url: API_URL + "/v1/options/checkbox" });
