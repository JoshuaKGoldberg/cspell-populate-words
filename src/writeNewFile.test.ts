import { describe, expect, it, vi } from "vitest";

import { writeNewFile } from "./writeNewFile.js";

const mockWriteFile = vi.fn();

vi.mock("node:fs/promises", () => ({
	get writeFile() {
		return mockWriteFile;
	},
}));

vi.mock("prettier", async () => ({
	...(await vi.importActual("prettier")),
	resolveConfig: () => ({ useTabs: true }),
}));

const mockResolve = vi.fn();

vi.mock("./resolve.js", () => ({
	get resolve() {
		return mockResolve;
	},
}));

const existingFile = { dictionaries: ["typescript"] };

const replacementWords = ["abc", "def"];

describe("writeNewFile", () => {
	it("prints JSON.stringify-formatted data when prettier cannot be imported", async () => {
		mockResolve.mockImplementationOnce(() => {
			throw new Error("Cannot find prettier.");
		});

		await writeNewFile(existingFile, replacementWords);

		expect(mockWriteFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "cspell.json",
			    "{
			  "dictionaries": [
			    "typescript"
			  ],
			  "words": [
			    "abc",
			    "def"
			  ]
			}",
			  ],
			]
		`);
	});

	it("prints prettier-formatted data when prettier can be imported", async () => {
		mockResolve.mockReturnValueOnce("prettier");

		await writeNewFile(existingFile, replacementWords);

		expect(mockWriteFile.mock.calls).toMatchInlineSnapshot(`
			[
			  [
			    "cspell.json",
			    "{
				"dictionaries": ["typescript"],
				"words": ["abc", "def"]
			}
			",
			  ],
			]
		`);
	});
});
