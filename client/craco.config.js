module.exports = {
	jest: {
		configure: {
			snapshotResolver: "./snapshotResolver.js",
		},
	},
	plugins: [{ plugin: require("@semantic-ui-react/craco-less") }],
};
