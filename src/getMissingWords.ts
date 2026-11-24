import childProcess from "node:child_process";

import { resolve } from "./resolve.js";

export async function getMissingWords(globs: string[], words: string[]) {
	const rawBin = resolve("cspell/bin");
	const bin = rawBin.replace(/^file:\/\//, "");

	const stdout = await getCSpellOutput(bin, globs, words);

	return stdout.split(/\s+/).filter(Boolean);
}

async function getCSpellOutput(bin: string, globs: string[], words: string[]) {
	return await new Promise<string>((complete) => {
		const { stdin } = childProcess.execFile(
			process.execPath,
			[bin, ...globs, "--quiet", "--words-only", "stdin"],
			(error, stdout) => {
				// If cspell passes, then there were no unknown words
				complete(error ? stdout : "");
			},
		);

		stdin?.on("error", () => undefined);
		stdin?.end(words.join(" "));
	});
}
