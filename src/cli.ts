import { parseArgs } from "node:util";

import { populateWords } from "./populateWords.js";

export async function cli(args: string[]) {
	const { positionals, values } = parseArgs({
		args,
		options: {
			words: {
				multiple: true,
				type: "string",
			},
		},
		strict: false,
	});

	const words = asArray(values.words);

	return await populateWords({ globs: positionals, words });
}

function asArray(words: (boolean | string)[] | undefined) {
	return words && Array.isArray(words) ? words.map((word) => String(word)) : [];
}
