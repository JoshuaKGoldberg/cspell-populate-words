import { describe, expect, it, vi } from "vitest";

import { cli } from "./cli.js";

const mockPopulateWords = vi.fn();

vi.mock("./populateWords.js", () => ({
	get populateWords() {
		return mockPopulateWords;
	},
}));

describe("cli", () => {
	it("passes parsed args to populateWords", async () => {
		await cli(["**", "--words", "typo"]);

		expect(mockPopulateWords).toHaveBeenCalledWith({
			globs: ["**"],
			words: ["typo"],
		});
	});
});
