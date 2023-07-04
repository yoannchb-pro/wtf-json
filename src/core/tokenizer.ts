import type TokenizerResult from "../types/tokenizerResult";

type Tokens = {
  [key: string]: RegExp;
};

type MatcherResult = {
  type: string;
  wordLength: number;
};

type Options = {
  tokens?: Tokens;
  defaultType?: string;
  callback?: (token: TokenizerResult) => TokenizerResult;
  concatDefaultType?: boolean;
};

const defaultOptions: Options = {
  tokens: {},
  defaultType: "UNKNOWN",
  concatDefaultType: true,
  callback: (token) => token,
};

/**
 * Tokenize any string with given tokens
 */
class Tokenizer {
  private options: Options = {};

  constructor(options: Options = {}) {
    this.options = Object.assign({}, defaultOptions, options);
  }

  /**
   * Set the default type if no token was match
   * Default: UNKNOWN
   * @param type
   */
  setDefaultType(type: string) {
    this.options.defaultType = type;
  }

  /**
   * Get the default type if no token was match
   * @returns
   */
  getDefaultType() {
    return this.options.defaultType;
  }

  /**
   * Get the list registered of the tokens
   * @returns
   */
  getTokens() {
    return this.options.tokens;
  }

  /**
   * Add a new token to match
   * @param type
   * @param value
   */
  addToken(type: string, value: RegExp) {
    this.options.tokens[type] = value;
  }

  /**
   * Set the callback function called on each new token
   * @param callback
   */
  setCallback(callback: Options["callback"]) {
    this.options.callback = callback;
  }

  /**
   * Check if a given token match the start of the string
   * @param str
   * @param type
   * @param value
   * @returns
   */
  private matcher(str: string, type: string, value: RegExp): MatcherResult {
    value.lastIndex = 0;
    const match = value.exec(str);
    if (!match || match.index !== 0) {
      return { type: this.options.defaultType, wordLength: 1 };
    }
    return {
      type,
      wordLength: match[0].length,
    };
  }

  /**
   * Tokenize a string
   * @param str
   * @returns
   */
  tokenize(str: string): TokenizerResult[] {
    const tokens: TokenizerResult[] = [];
    const lines = str.split(/\n/g);

    let totalCharDone = 0;
    for (let startLine = 0; startLine < lines.length; ++startLine) {
      const line = lines[startLine];

      for (let startColumn = 0; startColumn < line.length; ++startColumn) {
        const charIndex = startColumn + totalCharDone;

        let result = null;
        for (const [type, value] of Object.entries(this.options.tokens)) {
          result = this.matcher(
            str.substring(charIndex, str.length),
            type,
            value
          );
          if (result.type !== this.options.defaultType) break;
        }

        const matchedSentence = str.substring(
          charIndex,
          charIndex + result.wordLength
        );
        const matchedSentenceLinesNumber =
          matchedSentence.match(/\n/g)?.length ?? 0;
        const token = this.options.callback({
          type: result.type,
          value: matchedSentence,
          startLine,
          startColumn,
          endLine: startLine + matchedSentenceLinesNumber,
          endColumn: startColumn + result.wordLength - 1, // -1 because we don't want the next char but the last letter of the token value
        });
        if (
          this.options.concatDefaultType &&
          token.type === this.options.defaultType &&
          tokens.length !== 0 &&
          tokens[tokens.length - 1].type === this.options.defaultType
        ) {
          const lastToken = tokens[tokens.length - 1];
          lastToken.value += token.value;
          lastToken.endColumn = token.endColumn;
          lastToken.endLine = token.endLine;
        } else tokens.push(token);
        startColumn += result.wordLength - 1;
      }

      totalCharDone += line.length + 1; // +1 because the \n have a length of 1 and is removed by the split
    }

    return tokens;
  }
}

export default Tokenizer;
