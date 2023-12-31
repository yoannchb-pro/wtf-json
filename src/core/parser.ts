import type { ASTArray, ASTObject, ASTResult, ASTSimple } from "../types/ast";
import ASTBuilder from "./astBuilder";
import Tokenizer from "./tokenizer";

const TOKENS = {
  STRING: /("|'|`)(?:\\\1|.|\n)*?\1/,
  NUMBER: /(?:\d+(?:\.\d*)?)|(?:\.\d+)/,
  WHITE_SPACE: /\s+/,
  COMA: /,/,
  COLON: /:/,
  TRUE_BOOLEAN: /true/,
  FALSE_BOOLEAN: /false/,
  NULL: /null/,
  UNDEFINED: /undefined/,
  NAN: /NaN/,
  START_BRACKET: /\[/,
  END_BRACKET: /\]/,
  START_BRACE: /\{/,
  END_BRACE: /\}/,
} as const;

/**
 * JSON parser for a given string
 */
class Parser {
  private tokenizer = new Tokenizer({
    tokens: TOKENS,
  });
  private astBuilder = new ASTBuilder();

  /**
   * Parse a JSON string and return the object
   * @param str
   * @returns
   */
  parse<T = any>(str?: string | null | boolean | number | undefined): T {
    str = String(str);
    const tokens = this.tokenizer.tokenize(str);
    const ast = this.astBuilder.buildAST(tokens);
    if (ast.properties.length > 1)
      return ast.properties.map((property) =>
        this.parseASTBranch(property)
      ) as T;
    return (
      ast.properties.length > 0
        ? this.parseASTBranch(ast.properties[0])
        : undefined
    ) as T;
  }

  private parseASTBranch(astBranch: ASTResult["properties"][number]) {
    if (astBranch.type === "OBJECT") {
      return this.parseObject(astBranch);
    }

    if (astBranch.type === "ARRAY") {
      return this.parseArray(astBranch);
    }

    return this.parsePrimitif(astBranch);
  }

  private parseArray(astBranch: ASTArray) {
    const json: any[] = [];
    for (const property of astBranch.properties) {
      json.push(this.parseASTBranch(property));
    }
    return json;
  }

  private parseObject(astBranch: ASTObject) {
    const json: any = {};
    for (const property of astBranch.properties) {
      if (property.type !== "OBJECT_KEY") continue;
      json[property.name] =
        property.value === null ? null : this.parseASTBranch(property.value);
    }
    return json;
  }

  private parsePrimitif(astBranch: ASTSimple): any {
    return astBranch.value;
  }
}

export default Parser;
