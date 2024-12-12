import { getExistingFile } from "./getExistingFile.js";
import { getMissingWords } from "./getMissingWords.js";
import { writeNewFile } from "./writeNewFile.js";

export async function populateWords(glob: string) {
	if (!glob) {
		throw new Error(">=1 glob pattern required for files to run cspell on.");
	}

	const [existingFile, missingWords] = await Promise.all([
		getExistingFile(),
		getMissingWords(glob),
	]);

	if (!missingWords.length) {
		return;
	}

	const allWords = new Set([...(existingFile.words ?? []), ...missingWords]);

	const replacementWords = Array.from(allWords)
		.filter((word) => {
			const wordLowerCase = word.toLowerCase();
			return word === wordLowerCase || !allWords.has(wordLowerCase);
		})
		.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

	await writeNewFile(existingFile, replacementWords);
}
