import childProcess from "node:child_process";
import util from "node:util";
const exec = util.promisify(childProcess.exec);

export async function getMissingWords(glob: string) {
	const rawBin = import.meta.resolve("cspell/bin");
	const bin = rawBin.replace(/^file:\/\//, "");

	const { stdout } = await getCSpellOutput(bin, glob);

	return stdout.split(/\s+/).filter(Boolean);
}

async function getCSpellOutput(bin: string, glob: string) {
	try {
		return await exec(`node ${bin} ${glob} --quiet --words-only`);
	} catch (error) {
		return error as { stdout: string };
	}
}
