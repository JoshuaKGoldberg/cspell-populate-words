import { createCli } from "parse-standard-args";
import { z } from "zod";

import { populateWords } from "./populateWords.js";

const populateWordsCli = createCli({
	description: [
		"Populates your cspell.json dictionary with existing unknown words. 🔖",
		"File globs are passed to cspell. At least one glob or --words is required.",
	].join("\n"),
	examples: [
		`cspell-populate-words "**/*" ".github/**/*"`,
		"cspell-populate-words --words mistake --words typo",
	],
	name: "cspell-populate-words",
	options: z.object({
		words: z
			.array(z.string())
			.default([])
			.describe("Word to check with cspell, along with any globs")
			.meta({ placeholder: "word" }),
	}),
	positionals: z.array(z.string()).meta({ placeholder: "globs" }),
	positionalsUsage: "[globs...]",
	// Unknown flags have always been ignored, so existing scripts may pass them.
	strict: false,
});

export async function cli(args: string[]) {
	const parsed = await populateWordsCli.run(args);
	if (!parsed) {
		return undefined;
	}

	return await populateWords({
		globs: parsed.positionals,
		words: parsed.values.words,
	});
}
