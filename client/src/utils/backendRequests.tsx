export const API_URL = "http://localhost:5000/server";

export const requestScores = (args: string[][]) =>
	fetch(
		API_URL +
			"/v1/scores?ligands=" +
			args[0].join(",") +
			"&receptors=" +
			args[1].join(",") +
			"&interactions=" +
			args[2].join(",") +
			"&tumors=" +
			args[3].join(","),
		{
			method: "GET",
		}
	);

export const requestCheckboxOptions = () =>
	fetch(API_URL + "/v1/options/checkbox", {
		method: "GET",
	});

export const requestExp = (listGene: string[], tumorType: string) =>
	fetch(
		API_URL +
			"/v1/exp?genes=" +
			listGene.join(",") +
			"&tumortype=" +
			tumorType,
		{
			method: "GET",
		}
	);
