import fs from "fs";
import path from "path";
import wtfJson from "../dist";

describe("Should not throw an error for not working JSON", function () {
  const folder = path.resolve(__dirname, "./invalide-json-list");
  const files = fs.readdirSync(folder);

  test.each(files)("Test not valid json file that should parse: %s", (file) => {
    const content = fs.readFileSync(path.join(folder, file), "utf-8");
    expect(() => wtfJson(content)).not.toThrow();
  });
});
