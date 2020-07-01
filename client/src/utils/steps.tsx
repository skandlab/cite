import React from "react";

export const TourSteps: any = [
	{
		selector: '[data-tour="heatmapcards"]',
		content: (
			<>
				<p>
					Each heatmap shows Relative Crosstalk scores (<b>RC</b>) for
					a <strong>ligand-receptor pair</strong> across interaction
					types and tumor types.
				</p>
				<p>
					Sorted in descending order by the maximum value in each
					heatmap.
				</p>
				<p>
					Click on a square in the heatmaps to view cellwise data for{" "}
					<strong>ligand-tumor</strong> and{" "}
					<strong>receptor-tumor</strong> combinations.
				</p>
			</>
		),
		position: "top",
	},
	{
		selector: '[data-tour="filter"]',
		content: (
			<p>
				List of available filters to shortlist the heatmaps. By default,
				all heatmaps are shown.
			</p>
		),
		position: "top",
	},
	{
		selector: '[data-tour="0_filterInput"]',
		content: "Quick search for any item within a filter type.",
		position: "top",
	},
	{
		selector: '[data-tour="0_checkbox-list"]',
		content: (
			<>
				<p>
					List of items to choose from. Selected items are always at
					the top.
				</p>
				<p>
					For ligands and receptors, if no associated data is present
					then the checkbox will be dimmed as a hint.
				</p>
			</>
		),
		position: "top",
	},
	{
		selector: '[data-tour="0_resetButton"]',
		content: "Reset filter list to unfiltered state.",
		position: "top",
	},
	{
		selector: '[data-tour="0_statistic"]',
		content:
			"No. of items which have been filtered and total number of items available.",
		position: "top",
	},
	{
		selector: '[data-tour="summary"]',
		content: (
			<>
				<h3>Summary card</h3>
				<p>Total no. of pairs for the current filters.</p>
				<p>Also, no. of pairs on the current page.</p>
			</>
		),
		position: "top",
	},
	{
		selector: '[data-tour="colobar"]',
		content: "Legend of relative crosstalk score.",
		position: "top",
	},
];
