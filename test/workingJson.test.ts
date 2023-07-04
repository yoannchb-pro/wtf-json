import JSONParser from "../dist";

const json = {
  error: false,
  description: "some data",
  accurency: 53.6,
  glossary: {
    title: "example glossary",
    GlossDiv: {
      title: "S",
      GlossList: {
        GlossEntry: {
          ID: "SGML",
          SortAs: "SGML",
          GlossTerm: "Standard Generalized Markup Language",
          Acronym: "SGML",
          Abbrev: "ISO 8879:1986",
          GlossDef: {
            para: "A meta-markup language, used to create markup languages such as DocBook.",
            GlossSeeAlso: ["GML", "XML"],
          },
          GlossSee: "markup",
        },
      },
    },
  },
};

describe("Should parse a working JSON", function () {
  it("Should parse a working JSON", function () {
    expect(JSONParser(JSON.stringify(json))).toEqual(json);
  });
});
