export const APP_TITLE = "Tumeric";

export const ROUTE_PREFIX = "/ui";
export const ROUTE_HOME = ROUTE_PREFIX + "/";

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
