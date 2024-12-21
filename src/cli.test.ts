import { describe, expect, it, vi } from "vitest";

import { cli } from "./cli.js";

const mockPopulateWords = vi.fn();

vi.mock("./populateWords.js", () => ({
	get populateWords() {
		return mockPopulateWords;
	},
}));

describe("cli", () => {
	it("passes parsed args to populateWords when valid", async () => {
		await cli(["**", "--words", "typo"]);

		expect(mockPopulateWords).toHaveBeenCalledWith({
			globs: ["**"],
			words: ["typo"],
		});
	});

	it("passes nothing to populateWords when invalid", async () => {
		await cli(["--words"]);

		expect(mockPopulateWords).toHaveBeenCalledWith({
			globs: [],
			words: [],
		});
	});
});
