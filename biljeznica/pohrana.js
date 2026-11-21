import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FILE = join(process.cwd(), "zadaci.json");

export async function ucitajZadatke() {
  try {
    const text = await readFile(FILE, "utf-8");
    const data = JSON.parse(text);

    if (!Array.isArray(data)) {
      throw new Error("Sadržaj datoteke zadaci.json mora biti polje.");
    }

    return data;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error; 
  }
}

export async function spremiZadatke(zadaci) {
  await writeFile(FILE, JSON.stringify(zadaci, null, 2));
}