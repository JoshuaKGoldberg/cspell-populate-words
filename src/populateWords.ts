import { getExistingFile } from "./getExistingFile.js";
import { getMissingWords } from "./getMissingWords.js";
import { writeNewFile } from "./writeNewFile.js";

export type PopulateWordsSettings =
	| PopulateWordsSettingsWithGlobs
	| PopulateWordsSettingsWithWords;

export interface PopulateWordsSettingsWithGlobs {
	globs: string[];
	words?: string[];
}

export interface PopulateWordsSettingsWithWords {
	globs?: string[];
	words: string[];
}

export async function populateWords({
	globs = [],
	words = [],
}: PopulateWordsSettings) {
	if (!globs.length && !words.length) {
		throw new Error(
			">=1 file glob patterns and/or --words required to run cspell on.",
		);
	}

	const [existingFile, missingWords] = await Promise.all([
		getExistingFile(),
		getMissingWords(globs, words),
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

	return { replacementWords };
}
