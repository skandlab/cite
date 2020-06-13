const express = require("express");
const cors = require("cors");

const data = require("./__mockdata__.json");
let DeconvData = data["DeconvData"];
let CheckboxOptions = data["CheckboxOptions"];

const app = express();
app.use(cors());

app.get("/", (req, res) => {
	res.send("Hello world!");
});

const OptionsPerCard = CheckboxOptions.map((filter) =>
	filter.options.map((option) => option.value)
);

function generateData(
	card0 = OptionsPerCard[0], // ligands
	card1 = OptionsPerCard[1], // receptors
	card2 = OptionsPerCard[2], // interactions
	card3 = OptionsPerCard[3] // tumors
) {
	let result = [];
	for (let i = 0; i < card0.length; i++) {
		for (let j = 0; j < card1.length; j++) {
			result.push({
				ligand: card0[i],
				receptor: card1[j],
				data: {
					keys: card2,
					indexBy: "tumorType",
					xyValues: card3.map((tumorType) => {
						let tmp = {};
						tmp["tumorType"] = tumorType;
						card2.forEach((interaction) => {
							tmp[interaction] = Math.trunc(Math.random() * 100);
						});
						return tmp;
					}),
				},
			});
		}
	}
	return result;
}

// Endpoints
app.get("/server/v1/options/checkbox", (req, res) => {
	return res.send(JSON.stringify(CheckboxOptions));
});

app.get("/server/v1/scores", (req, res) => {
	let ligands = req.query.ligands.split(",").filter((o) => o);
	if (ligands.length === 0) {
		ligands = OptionsPerCard[0];
	}

	let receptors = req.query.receptors.split(",").filter((o) => o);
	if (receptors.length === 0) {
		receptors = OptionsPerCard[1];
	}

	let interactions = req.query.interactions.split(",").filter((o) => o);
	if (interactions.length === 0) {
		interactions = OptionsPerCard[2];
	}

	let tumors = req.query.tumors.split(",").filter((o) => o);
	if (tumors.length === 0) {
		tumors = OptionsPerCard[3];
	}

	return res.send(
		JSON.stringify(generateData(ligands, receptors, interactions, tumors))
	);
});

app.get("/server/v1/deconv", (req, res) => {
	let [gene1, gene2] = req.query.genes.split(",").filter((o) => o);

	return res.send(
		JSON.stringify([
			{ ...DeconvData[0], gene: gene1 },
			{ ...DeconvData[1], gene: gene2 },
		])
	);
});

if (require.main === module) {
	app.listen(5000, () => {
		console.log(`server started at http://localhost:5000`);
	});
}

module.exports = OptionsPerCard;
