import fs from "fs";
import path from "path";
import JSONParser from "../dist";

describe("Should throw an error for not working JSON", function () {
  it("Should throw an error", function () {
    for (let i = 1; i < 30; ++i) {
      const folder = path.resolve(__dirname, "./invalide-json-list");
      expect(() => {
        const file = path.join(folder, i + ".txt");
        const content = fs.readFileSync(file, "utf-8");
        JSONParser(content);
      }).toThrow(SyntaxError);
    }
  });
});
