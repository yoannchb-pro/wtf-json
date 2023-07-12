import wtfJson from "../dist";

describe("Should parse simple type", function () {
  it("Should parse null str", function () {
    expect(wtfJson("null")).toBe(null);
  });

  it("Should parse true str", function () {
    expect(wtfJson("true")).toBe(true);
  });

  it("Should parse false str", function () {
    expect(wtfJson("false")).toBe(false);
  });

  it("Should parse a string str", function () {
    expect(wtfJson('"hello world"')).toBe("hello world");
  });

  it("Should parse a number str", function () {
    expect(wtfJson("53.6")).toBe(53.6);
  });

  it("Should parse null", function () {
    expect(wtfJson(null as any)).toBe(null);
  });

  it("Should parse true", function () {
    expect(wtfJson(true)).toBe(true);
  });

  it("Should parse false", function () {
    expect(wtfJson(false)).toBe(false);
  });

  it("Should parse a number", function () {
    expect(wtfJson(53.6)).toBe(53.6);
  });

  it("Should parse unknown", function () {
    expect(wtfJson("hello")).toBe("hello");
  });

  it("Should parse NaN", function () {
    expect(wtfJson(NaN)).toBe(NaN);
  });

  it("Should parse NaN str", function () {
    expect(wtfJson("NaN")).toBe(NaN);
  });

  it("Should parse undefined", function () {
    expect(wtfJson(undefined as any)).toBe(undefined);
  });

  it("Should parse undefined str", function () {
    expect(wtfJson("undefined")).toBe(undefined);
  });

  it("Should parse without argument", function () {
    expect(wtfJson()).toBe(undefined);
  });

  it("Should parse with empty str", function () {
    expect(wtfJson("")).toBe(undefined);
  });

  it("Should parse with white space str", function () {
    expect(
      wtfJson(`
        
            
    `)
    ).toBe(undefined);
  });

  it("Should parse multiple types 1", function () {
    expect(wtfJson("null,{}")).toEqual([null, {}]);
  });

  it("Should parse multiple types 2", function () {
    expect(wtfJson("true,")).toBe(true);
  });

  it("Should parse multiple types 3", function () {
    expect(wtfJson(",hello")).toBe("hello");
  });

  it("Type test", function () {
    expect(wtfJson<{ id: number }>("{ id: 6 }").id).toBe(6);
  });
});
