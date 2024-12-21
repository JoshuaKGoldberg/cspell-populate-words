import childProcess from "node:child_process";
import util from "node:util";

import { resolve } from "./resolve.js";
const exec = util.promisify(childProcess.exec);

export async function getMissingWords(globs: string[], words: string[]) {
	const rawBin = resolve("cspell/bin");
	const bin = rawBin.replace(/^file:\/\//, "");

	const { stdout } = await getCSpellOutput(bin, globs, words);

	return stdout.split(/\s+/).filter(Boolean);
}

async function getCSpellOutput(bin: string, globs: string[], words: string[]) {
	try {
		// If cspell passes, then there were no unknown words
		await exec(
			`echo "${words.join(" ")}" | node ${bin} ${globs.join(" ")}  --quiet --words-only stdin`,
		);
		return { stdout: "" };
	} catch (error) {
		return error as { stdout: string };
	}
}
