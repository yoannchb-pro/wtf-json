import JSONParser from "../dist";

describe("Should parse simple type", function () {
  it("Should parse null str", function () {
    expect(JSONParser("null")).toBe(null);
  });

  it("Should parse true str", function () {
    expect(JSONParser("true")).toBe(true);
  });

  it("Should parse false str", function () {
    expect(JSONParser("false")).toBe(false);
  });

  it("Should parse a string str", function () {
    expect(JSONParser('"hello world"')).toBe("hello world");
  });

  it("Should parse a number str", function () {
    expect(JSONParser("53.6")).toBe(53.6);
  });

  it("Should parse null", function () {
    expect(JSONParser(null as any)).toBe(null);
  });

  it("Should parse true", function () {
    expect(JSONParser(true)).toBe(true);
  });

  it("Should parse false", function () {
    expect(JSONParser(false)).toBe(false);
  });

  it("Should parse a number", function () {
    expect(JSONParser(53.6)).toBe(53.6);
  });

  it("Should not parse string", function () {
    expect(() => JSONParser("hello")).toThrow(SyntaxError);
  });
});
