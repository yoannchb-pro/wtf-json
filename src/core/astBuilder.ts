import type {
  ASTAnyValue,
  ASTArray,
  ASTBoolean,
  ASTChildren,
  ASTNaN,
  ASTNull,
  ASTNumber,
  ASTObject,
  ASTObjectKey,
  ASTResult,
  ASTString,
  ASTUndefined,
} from "../types/ast";
import type TokenizerResult from "../types/tokenizerResult";

/**
 * Unraw a string to transform for example \\n to \n
 * @param rawString
 * @returns
 */
function unrawString(rawString: string) {
  return rawString.replace(/\\(.)/g, function (_, char) {
    if (char === "n") return "\n";
    if (char === "r") return "\r";
    if (char === "t") return "\t";
    if (char === "b") return "\b";
    if (char === "f") return "\f";
    if (char === "v") return "\v";
    return char;
  });
}

class ASTBuilder {
  /**
   * Return the error message for a given token
   * @param token
   * @returns
   */
  getErrorMessage(token: TokenizerResult) {
    return `"${token.value}" is not valid JSON\nline: ${token.startLine}, column: ${token.startColumn}`;
  }

  /**
   * Format a string token to remove useless quotes and parse unicode
   * @param str
   * @returns
   */
  private formatStr(str: string) {
    const content =
      /(`|'|")/.test(str.charAt(0)) &&
      /(`|'|")/.test(str.charAt(str.length - 1))
        ? str.substring(1, str.length - 1)
        : str;
    return unrawString(content); // turn \\n into \n ...
  }

  private appendBoolean(token: TokenizerResult): ASTBoolean {
    return {
      type: "BOOLEAN",
      value: token.type === "TRUE_BOOLEAN" ? true : false,
    };
  }

  private appendNullValue(token: TokenizerResult): ASTNull {
    return {
      type: "NULL_VALUE",
      value: null,
    };
  }

  private appendUndefinedValue(token: TokenizerResult): ASTUndefined {
    return {
      type: "UNDEFINED_VALUE",
      value: undefined,
    };
  }

  private appendNaNValue(token: TokenizerResult): ASTNaN {
    return {
      type: "NAN_VALUE",
      value: NaN,
    };
  }

  private appendString(token: TokenizerResult): ASTString {
    return {
      type: "STRING",
      value: this.formatStr(token.value),
    };
  }

  private appendArray(token: TokenizerResult): ASTArray {
    return {
      type: "ARRAY",
      properties: [],
    };
  }

  private appendObject(token: TokenizerResult): ASTObject {
    return {
      type: "OBJECT",
      properties: [],
    };
  }

  private appendNumber(token: TokenizerResult): ASTNumber {
    return {
      type: "NUMBER",
      value: Number(token.value),
    };
  }

  private appendKey(token: TokenizerResult): ASTObjectKey {
    return {
      type: "OBJECT_KEY",
      name: this.formatStr(token.value),
      value: null,
    };
  }

  /**
   * Build the AST for given tokens
   * @param tokens
   * @returns
   */
  buildAST(tokens: TokenizerResult[]) {
    const tree: ASTResult = { type: "JSON", properties: [] };
    const childrens: ASTChildren[] = [tree];

    let lastScannedToken: TokenizerResult = null;
    for (let i = 0; i < tokens.length; ++i) {
      const actualToken = tokens[i];
      const actualChild = childrens[childrens.length - 1];

      const addASTBranch = (branch: ASTAnyValue) => {
        if ("value" in actualChild) {
          (actualChild as any).value = branch;
        } else actualChild.properties.push(branch as any);
      };

      if (
        actualToken.type === "TRUE_BOOLEAN" ||
        actualToken.type === "FALSE_BOOLEAN"
      ) {
        addASTBranch(this.appendBoolean(actualToken));
      } else if (actualToken.type === "NULL") {
        addASTBranch(this.appendNullValue(actualToken));
      } else if (actualToken.type === "UNDEFINED") {
        addASTBranch(this.appendUndefinedValue(actualToken));
      } else if (actualToken.type === "NAN") {
        addASTBranch(this.appendNaNValue(actualToken));
      } else if (actualToken.type === "NUMBER") {
        addASTBranch(this.appendNumber(actualToken));
      } else if (
        actualToken.type === "STRING" ||
        actualToken.type === "UNKNOWN"
      ) {
        if (actualChild.type === "OBJECT_KEY" && actualChild.value !== null)
          childrens.pop();

        if (actualChild.type === "OBJECT") {
          const child = this.appendKey(actualToken);
          addASTBranch(child);
          childrens.push(child);
        } else addASTBranch(this.appendString(actualToken));
      } else if (actualToken.type === "START_BRACKET") {
        const child = this.appendArray(actualToken);
        addASTBranch(child);
        childrens.push(child);
      } else if (actualToken.type === "START_BRACE") {
        const child = this.appendObject(actualToken);
        addASTBranch(child);
        childrens.push(child);
      } else if (actualToken.type === "END_BRACKET" && childrens.length !== 1) {
        childrens.pop();
      } else if (actualToken.type === "END_BRACE" && childrens.length !== 1) {
        if (actualChild.type === "OBJECT_KEY") childrens.pop();
        childrens.pop();
      } else if (actualToken.type === "COMA") {
        if (actualChild.type === "OBJECT_KEY") childrens.pop();
      } else if (actualToken.type === "COLON") {
        //TODO: Actually we skip useless COLON
      }

      if (actualToken.type !== "WHITE_SPACE") lastScannedToken = actualToken;
    }

    return tree;
  }
}

export default ASTBuilder;
