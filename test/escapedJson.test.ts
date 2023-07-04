import JSONParser from "../dist";

const json = {
  "\"": true,
  key: 'Yoann said "You are beautiful"',
  key2: "Line 1 \n Line 2",
};

describe("Should parse JSON with escape char", function () {
  it("Should parse null", function () {
    expect(JSONParser(JSON.stringify(json))).toEqual(json);
  });
});
