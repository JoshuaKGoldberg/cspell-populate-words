import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cli } from "./cli.js";

const mockPopulateWords = vi.fn();

vi.mock("./populateWords.js", () => ({
	get populateWords() {
		return mockPopulateWords;
	},
}));

const mockError = vi.fn();
const mockLog = vi.fn();

describe("cli", () => {
	beforeEach(() => {
		// Stubbed instead of spied on, so console-fail-test doesn't see the calls.
		vi.stubGlobal("console", { ...console, error: mockError, log: mockLog });
	});

	afterEach(() => {
		process.exitCode = undefined;
		vi.unstubAllGlobals();
	});

	it("passes globs and words to populateWords", async () => {
		await cli(["**", "--words", "typo"]);

		expect(mockPopulateWords).toHaveBeenCalledWith({
			globs: ["**"],
			words: ["typo"],
		});
	});

	it("passes multiple globs and repeated words to populateWords", async () => {
		await cli(["src/**", "--words", "a", "docs/**", "--words=b"]);

		expect(mockPopulateWords).toHaveBeenCalledWith({
			globs: ["src/**", "docs/**"],
			words: ["a", "b"],
		});
	});

	it("defaults globs and words to empty arrays", async () => {
		await cli([]);

		expect(mockPopulateWords).toHaveBeenCalledWith({
			globs: [],
			words: [],
		});
	});

	it("returns the result of populateWords", async () => {
		const result = { replacementWords: ["typo"] };
		mockPopulateWords.mockResolvedValueOnce(result);

		expect(await cli(["--words", "typo"])).toBe(result);
	});

	it("reports an error without calling populateWords when --words is missing a value", async () => {
		const result = await cli(["--words"]);

		expect(result).toBeUndefined();
		expect(mockPopulateWords).not.toHaveBeenCalled();
		expect(mockError.mock.calls).toEqual([
			[
				"--words requires a value.\nRun 'cspell-populate-words --help' for usage.",
			],
		]);
		expect(process.exitCode).toBe(1);
	});

	it("ignores unknown flags", async () => {
		await cli(["--word", "--verbose=true", "**"]);

		expect(mockPopulateWords).toHaveBeenCalledWith({
			globs: ["**"],
			words: [],
		});
		expect(mockError).not.toHaveBeenCalled();
		expect(process.exitCode).toBeUndefined();
	});

	it("prints help without calling populateWords when --help is provided", async () => {
		const result = await cli(["--help"]);

		expect(result).toBeUndefined();
		expect(mockPopulateWords).not.toHaveBeenCalled();
		expect(mockLog.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "Usage: cspell-populate-words [options] [globs...]

			Populates your cspell.json dictionary with existing unknown words. 🔖
			File globs are passed to cspell. At least one glob or --words is required.

			Options:
			      --words <word>  Word to check with cspell, along with any globs (default: [], repeatable)
			  -h, --help          Show this help message

			Examples:
			  cspell-populate-words "**/*" ".github/**/*"
			  cspell-populate-words --words mistake --words typo",
			  ],
			]
		`);
		expect(process.exitCode).toBeUndefined();
	});
});
