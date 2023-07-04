import Parser from "./core/parser";

const parser = new Parser();

export default parser.parse.bind(parser) as Parser["parse"];
