import { describe, expect, it, vi } from "vitest";

import { getMissingWords } from "./getMissingWords.js";

const mockExec =
	vi.fn<(command: string) => Promise<[Error | undefined, unknown?]>>();

vi.mock("node:child_process", () => ({
	default: {
		exec(
			command: string,
			callback: (_error: unknown, result: unknown) => void,
		) {
			return mockExec(command)
				.then((result) => {
					callback(...result);
				})
				.catch((error: unknown) => {
					callback(error, undefined);
				});
		},
	},
}));

vi.mock("./resolve.js", () => ({
	resolve: () => "node_modules/cspell/bin",
}));

describe("getMissingWords", () => {
	it("returns none when cspell passes", async () => {
		mockExec.mockResolvedValueOnce([undefined, { stdout: "cspell passed." }]);

		const missingWords = await getMissingWords(`"**/*"`);

		expect(missingWords).toEqual([]);
	});

	it("returns the missing words when cspell fails", async () => {
		mockExec.mockRejectedValueOnce({ stdout: "abc def" });

		const missingWords = await getMissingWords(`"**/*"`);

		expect(missingWords).toEqual(["abc", "def"]);
	});
});