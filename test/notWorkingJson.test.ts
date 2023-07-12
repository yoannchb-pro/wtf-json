import fs from "fs";
import path from "path";
import wtfJson from "../dist";

describe("Should throw an error for not working JSON", function () {
  it("Should throw an error", function () {
    const folder = path.resolve(__dirname, "./invalide-json-list");
    for (let i = 1; i < 30; ++i) {
      const file = path.join(folder, i + ".txt");
      const content = fs.readFileSync(file, "utf-8");
      expect(() => wtfJson(content)).not.toThrow();
    }
  });
});
