import {
	blockCodecov,
	blockCTATransitions,
	blockESLint,
	blockVitest,
	createConfig,
} from "create-typescript-app";

export default createConfig({
	refinements: {
		addons: [
			blockCodecov({
				env: {
					CODECOV_TOKEN: "${{ secrets.CODECOV_TOKEN }}",
				},
			}),
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
			blockVitest({
				coverage: {
					exclude: ["lib", "src/resolve.ts"],
				},
			}),
		],
		blocks: {
			add: [blockCTATransitions],
		},
	},
});
