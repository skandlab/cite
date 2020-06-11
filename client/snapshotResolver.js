module.exports = {
	testPathForConsistencyCheck: "src/views/hoc/pagination.test.tsx",
	resolveSnapshotPath: (testPath, snapshotExtension) =>
		testPath + snapshotExtension,
	resolveTestPath: (snapshotFilePath, snapshotExtension) =>
		snapshotFilePath.slice(0, -snapshotExtension.length),
};
