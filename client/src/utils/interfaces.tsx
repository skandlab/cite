export interface InterfaceData {
	ligand: string;
	receptor: string;
	scoreMatrix: {
		tumorType: string;
		[key: string]: string;
	}[];
}
