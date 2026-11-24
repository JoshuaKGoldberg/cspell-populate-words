import { describe, expect, it, vi } from "vitest";

import { getMissingWords } from "./getMissingWords.js";

const mockExecFile =
	vi.fn<
		(file: string, args: string[]) => [error: Error | undefined, stdout: string]
	>();

const mockStdin = {
	end: vi.fn(),
	on: vi.fn(),
};

vi.mock("node:child_process", () => ({
	default: {
		execFile(
			file: string,
			args: string[],
			callback: (error: Error | undefined, stdout: string) => void,
		) {
			mockStdin.end.mockImplementationOnce(() => {
				callback(...mockExecFile(file, args));
			});

			return { stdin: mockStdin };
		},
	},
}));

vi.mock("./resolve.js", () => ({
	resolve: () => "node_modules/cspell/bin.mjs",
}));

describe("getMissingWords", () => {
	it("returns none when cspell passes", async () => {
		mockExecFile.mockReturnValueOnce([undefined, "cspell passed."]);

		const missingWords = await getMissingWords(["**/*"], ["abc", "def"]);

		expect(missingWords).toEqual([]);
		expect(mockStdin.end.mock.calls).toEqual([["abc def"]]);
		expect(mockExecFile.mock.calls).toEqual([
			[
				process.execPath,
				[
					"node_modules/cspell/bin.mjs",
					"**/*",
					"--quiet",
					"--words-only",
					"stdin",
				],
			],
		]);
	});

	it("returns the missing words when cspell fails", async () => {
		mockExecFile.mockReturnValueOnce([new Error("Oh no!"), "abc\ndef\n"]);

		const missingWords = await getMissingWords(["**/*"], ["abc", "def"]);

		expect(missingWords).toEqual(["abc", "def"]);
	});

	it("passes words with shell syntax to cspell as-is", async () => {
		mockExecFile.mockReturnValueOnce([undefined, ""]);

		await getMissingWords(["$(one)"], ["$(two)", "`three`", `"four"`]);

		expect(mockStdin.end).toHaveBeenCalledWith('$(two) `three` "four"');
		expect(mockExecFile.mock.calls[0][1]).toContain("$(one)");
	});

	it("does not crash when cspell exits before reading all of stdin", async () => {
		mockExecFile.mockReturnValueOnce([new Error("Oh no!"), ""]);

		const missingWords = await getMissingWords([], ["abc"]);

		expect(missingWords).toEqual([]);
		expect(mockStdin.on).toHaveBeenCalledWith("error", expect.any(Function));
	});
});
