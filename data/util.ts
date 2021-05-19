import parse from "csv-parse/lib/sync";
import { readFile } from "fs/promises";

export function randomInt(min: number, max: number) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function readFromCSV(filePath: string): Promise<any[]> {
   try {
      const buff = await readFile(filePath);
      const records = parse(buff.toString(), {
         columns: true,
         skip_empty_lines: true
      });

      console.log(`Total of ${records.length} records read from CSV.`);
      return records;
   } catch (err) {
      console.log(err);
      return err;
   }
}
