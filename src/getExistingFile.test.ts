import { describe, expect, it, vi } from "vitest";

import { getExistingFile } from "./getExistingFile.js";

const mockReadFile = vi.fn();

vi.mock("node:fs/promises", () => ({
	get readFile() {
		return mockReadFile;
	},
}));

describe("getExistingFile", () => {
	it("returns file data when cspell.json exists", async () => {
		const data = { words: ["abc"] };

		mockReadFile.mockResolvedValueOnce(JSON.stringify(data));

		const actual = await getExistingFile();

		expect(actual).toEqual(data);
	});

	it("returns an object with empty words array when cspell.json does not exist", async () => {
		mockReadFile.mockRejectedValueOnce(new Error("File does not exist."));

		const actual = await getExistingFile();

		expect(actual).toEqual({ words: [] });
	});
});
