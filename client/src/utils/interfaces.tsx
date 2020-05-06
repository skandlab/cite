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

export interface InterfaceExpressionEndpoint {
	gene: string;
	tumorType: string;
	scatterplot: {
		name: string;
		value: [number, number];
	}[];
	barplot: {
		name: string;
		value: number;
	}[];
	lineplot: {
		name: string;
		value: [number, number];
	}[];
}
