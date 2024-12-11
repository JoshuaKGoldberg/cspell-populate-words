import childProcess from "node:child_process";
import util from "node:util";

import { resolve } from "./resolve.js";
const exec = util.promisify(childProcess.exec);

export async function getMissingWords(glob: string) {
	const rawBin = resolve("cspell/bin");
	const bin = rawBin.replace(/^file:\/\//, "");

	const { stdout } = await getCSpellOutput(bin, glob);

	return stdout.split(/\s+/).filter(Boolean);
}

async function getCSpellOutput(bin: string, glob: string) {
	try {
		// If cspell passes, then there were no unknown words
		await exec(`node ${bin} ${glob} --quiet --words-only`);
		return { stdout: "" };
	} catch (error) {
		return error as { stdout: string };
	}
}
