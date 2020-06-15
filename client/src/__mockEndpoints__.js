const express = require("express");
const cors = require("cors");

const data = require("./__mockdata__.json");
let DeconvData = data["DeconvData"];
let CheckboxOptions = data["CheckboxOptions"];

const app = express();
app.use(cors());

const OptionsPerCard = CheckboxOptions.map((filter) =>
	filter.options.map((option) => option.value)
);

let a = {};
OptionsPerCard[0].forEach((item) => (a[item] = true));
let b = {};
OptionsPerCard[1].forEach((item) => (b[item] = true));
let c = {};
OptionsPerCard[2].forEach((item) => (c[item] = false));
let d = {};
OptionsPerCard[3].forEach((item) => (d[item] = false));

function generateData(
	card0 = OptionsPerCard[0], // ligands
	card1 = OptionsPerCard[1], // receptors
	card2 = OptionsPerCard[2], // interactions
	card3 = OptionsPerCard[3] // tumors
) {
	let result = [];
	let l = { ...a };
	let r = { ...b };
	for (let i = 0; i < card0.length; i++) {
		for (let j = 0; j < card1.length; j++) {
			l[card0[i]] = false;
			r[card1[j]] = false;
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

	return {
		scores: result,
		itemIsPresent: [
			{ filterType: "ligands", itemIsPresent: l },
			{ filterType: "receptors", itemIsPresent: r },
			{ filterType: "interactions", itemIsPresent: c },
			{ filterType: "tumors", itemIsPresent: d },
		],
	};
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
