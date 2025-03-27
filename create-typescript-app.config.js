import {
	blockCTATransitions,
	blockESLint,
	createConfig,
} from "create-typescript-app";

export default createConfig({
	refinements: {
		addons: [
			blockESLint({
				rules: [
					{
						entries: {
							"n/no-unsupported-features/node-builtins": [
								"error",
								{ allowExperimental: true },
							],
						},
					},
				],
			}),
		],
		blocks: {
			add: [blockCTATransitions],
		},
	},
});
