export interface InterfaceColumnBrowserProps {
	value: string;
	isChecked: boolean;
	description?: string;
}

export interface InterfaceScores {
	ligand: string;
	receptor: string;
	scoreMatrix: {
		tumorType: string;
		[key: string]: string;
	}[];
}
