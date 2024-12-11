import { describe, expect, it, vi } from "vitest";

import { populateWords } from "./index.js";

const mockGetExistingFile = vi.fn();
const mockGetMissingWords = vi.fn();
const mockWriteNewFile = vi.fn();

vi.mock("./getExistingFile.js", () => ({
	get getExistingFile() {
		return mockGetExistingFile;
	},
}));

vi.mock("./getMissingWords.js", () => ({
	get getMissingWords() {
		return mockGetMissingWords;
	},
}));

vi.mock("./writeNewFile.js", () => ({
	get writeNewFile() {
		return mockWriteNewFile;
	},
}));

describe("populateWords", () => {
	it("does not write when there are no missing words", async () => {
		mockGetExistingFile.mockResolvedValue({});
		mockGetMissingWords.mockResolvedValue([]);

		await populateWords();

		expect(mockWriteNewFile).not.toHaveBeenCalled();
	});

	it("writes when there is a missing word and no existing words", async () => {
		const existingFile = {};
		const missingWords = ["missing"];

		mockGetExistingFile.mockResolvedValue(existingFile);
		mockGetMissingWords.mockResolvedValue(missingWords);

		await populateWords();

		expect(mockWriteNewFile).toHaveBeenCalledWith(existingFile, ["missing"]);
	});

	it("writes when there is a missing word against existing words", async () => {
		const existingFile = { words: ["existing"] };
		const missingWords = ["missing"];

		mockGetExistingFile.mockResolvedValue(existingFile);
		mockGetMissingWords.mockResolvedValue(missingWords);

		await populateWords();

		expect(mockWriteNewFile).toHaveBeenCalledWith(existingFile, [
			"existing",
			"missing",
		]);
	});

	it("writes only the lowercase version when a missing has multiple capitalizations", async () => {
		const existingFile = { words: ["existing"] };
		const missingWords = ["missing", "Missing"];

		mockGetExistingFile.mockResolvedValue(existingFile);
		mockGetMissingWords.mockResolvedValue(missingWords);

		await populateWords();

		expect(mockWriteNewFile).toHaveBeenCalledWith(existingFile, [
			"existing",
			"missing",
		]);
	});
});
