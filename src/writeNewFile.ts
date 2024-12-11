import * as fs from "node:fs/promises";

import { CSpellData } from "./types.js";

export async function writeNewFile(
	existingFile: CSpellData,
	replacementWords: string[],
) {
	const fileDataRaw = JSON.stringify(
		{
			...existingFile,
			words: replacementWords,
		},
		null,
		2,
	);

	const prettier = await importPrettierIfAvailable();

	const fileDataFormatted = prettier
		? await prettier.format(fileDataRaw, {
				filepath: "cspell.json",
				parser: "json",
				...(await prettier.resolveConfig("cspell.json")),
			})
		: fileDataRaw;

	await fs.writeFile("cspell.json", fileDataFormatted);
}

async function importPrettierIfAvailable() {
	try {
		const prettierPath = import.meta.resolve("prettier");
		return (await import(prettierPath)) as typeof import("prettier");
	} catch {
		return undefined;
	}
}
