import axios from "axios";

const API_URL = "/server";

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

export const requestExp = (listGene: string[], tumorType: string) =>
	axios.request({
		method: "GET",
		url:
			API_URL +
			"/v1/exp?genes=" +
			listGene.join(",") +
			"&tumortype=" +
			tumorType,
	});
