import * as fs from "node:fs/promises";

import { CSpellData } from "./types.js";

export async function getExistingFile() {
	try {
		return JSON.parse(
			(await fs.readFile("cspell.json")).toString(),
		) as CSpellData;
	} catch {
		return { words: [] };
	}
}
