#!/usr/bin/env node
import { populateWords } from "../lib/index.js";

await populateWords(process.argv.slice(2).join(" "));
