type MatcherResult<T extends Tokens, D extends string, A extends boolean> = {
  type: TokenType<T, D, A>;
  value: string;
  groups?: Record<string, string>;
  index: number;
};

type Tokens = {
  [key: string]: RegExp;
};

type TokenType<T extends Tokens, D extends string, A extends boolean> =
  | keyof T
  | (A extends true ? D | Omit<string, keyof T | D> : D);

type Token<T extends Tokens, D extends string, A extends boolean> = {
  type: TokenType<T, D, A>;
  value: string;
  groups?: Record<string, string>;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
};

type Options<T extends Tokens, D extends string, A extends boolean> = {
  tokens: T;
  defaultType: D;
  prioritize?: boolean;
  callback?: (
    token: Token<T, D, A>,
    prevTokens: Token<T, D, A>[]
  ) => Token<T, D, A> | null;
  concatDefaultType?: boolean;
  authorizeAdditionalTokens?: A;
};

const defaultOptions = {
  defaultType: "UNKNOWN",
  concatDefaultType: true,
} as const satisfies Partial<Options<{}, "UNKNOWN", false>>;

type ConstructorOptions<
  T extends Tokens,
  D extends string,
  A extends boolean
> = Omit<Options<T, D, A>, keyof typeof defaultOptions> &
  Partial<Pick<Options<T, D, A>, keyof typeof defaultOptions>>;

/**
 * Tokenize any string with given tokens
 */
class Tokenizer<
  T extends Tokens,
  D extends string = "UNKNOWN",
  A extends boolean = false
> {
  public static BUILT_IN_RULES = {
    WORD: /\w+/,
    NUMBER: /\d+(?:\.\d+)?/,

    ONE_LINE_COMMENT: /\/\/.*/,
    MULTIPLE_LINE_COMMENT: /\/\*[\s\S]*?\*\//,

    STRING: /("|'|`)(?<content>(?:\\\1|.)*?)\1/,
    DOUBLE_QUOTE_STRING: /(")(?<content>(?:\\\1|.)*?)\1/,
    SINGLE_QUOTE_STRING: /(')(?<content>(?:\\\1|.)*?)\1/,
    GRAVE_ACCENT_STRING: /(`)(?<content>(?:\\\1|.)*?)\1/,

    WHITE_SPACES: /\s+/,
    NEW_LINES: /\n+/,
  } as const satisfies Record<string, RegExp>;
  private options: Options<T, D, A>;

  constructor(_options: ConstructorOptions<T, D, A>) {
    if (!_options || !_options.tokens)
      throw new Error('Invalide options: "tokens" is required');
    this.options = Object.assign({}, defaultOptions, _options);
  }

  /**
   * Get the default type if no token was match
   * @returns
   */
  getDefaultType(): D {
    return this.options.defaultType;
  }

  /**
   * Get the list registered of the tokens
   * @returns
   */
  getTokens(): T {
    return this.options.tokens;
  }

  /**
   * Get the list of tokens name
   * @returns
   */
  getTokensName(): (keyof T | D)[] {
    return [...Object.keys(this.options.tokens), this.getDefaultType()];
  }

  /**
   * Check if a given token match the start of the string
   * @param str
   * @param type
   * @param reg
   * @returns
   */
  private matcher(
    str: string,
    type: string,
    reg: RegExp
  ): MatcherResult<T, D, A> | null {
    reg.lastIndex = 0;
    const match = reg.exec(str);

    if (!match) return null;

    return {
      type,
      value: match[0],
      groups: match.groups,
      index: match.index,
    };
  }

  /**
   * Tokenize a string
   * @param str
   * @returns
   */
  tokenize(str: string): Token<T, D, A>[] {
    if (typeof str !== "string") return [];

    const tokens: Token<T, D, A>[] = [];

    const defaultType = this.getDefaultType();
    const concatDefaultType = this.options.concatDefaultType;
    const tokensList = Object.entries(this.options.tokens);

    let index = 0;
    let line = 0;
    let column = 0;

    while (index < str.length) {
      const remaining = str.slice(index);

      let result: MatcherResult<T, D, A> | null = null;

      // Check if any regex is matching
      for (const [type, reg] of tokensList) {
        reg.lastIndex = 0;
        const match = reg.exec(remaining);
        if (match && match.index === 0) {
          result = {
            type,
            value: match[0],
            groups: match.groups,
            index: 0,
          };
          break;
        }
      }

      // No match -> default token
      if (!result) {
        result = {
          type: defaultType,
          value: remaining[0],
          index: 0,
        };
      }

      // Line, column calculation
      const value = result.value;
      const lines = value.split("\n");
      const startLine = line;
      const startColumn = column;
      let endLine = line;
      let endColumn = column;

      if (lines.length > 1) {
        endLine = line + lines.length - 1;
        endColumn = lines[lines.length - 1].length;
      } else {
        endColumn = column + value.length;
      }

      // Update current line/column
      line = endLine;
      column = endColumn;

      let token: Token<T, D, A> | null = {
        type: result.type,
        value: result.value,
        ...(result.groups ? { groups: result.groups } : {}),
        startLine,
        startColumn,
        endLine,
        endColumn,
      };

      token = this.options.callback
        ? this.options.callback(token, tokens)
        : token;

      // We update the char index based on what we have match
      index += value.length;

      // Check the new token returned by the callback
      if (token === null) continue;
      if (
        !this.options.authorizeAdditionalTokens &&
        !this.getTokensName().includes(token.type as keyof T | D)
      ) {
        throw new Error(
          `Unknown token type returned by the callback: "${
            token.type as string
          }" (If you want to allow other types please set authorizeAdditionalTokens to true)`
        );
      }

      const isTokenDefaultType = token.type === defaultType;
      const needConcatenation =
        concatDefaultType &&
        isTokenDefaultType &&
        tokens.length !== 0 &&
        tokens[tokens.length - 1].type === defaultType;
      if (needConcatenation) {
        // Concatenation with the last token if needed
        const lastToken = tokens[tokens.length - 1];
        lastToken.value += token.value;
        lastToken.endColumn = token.endColumn;
        lastToken.endLine = token.endLine;
      } else {
        tokens.push(token);
      }
    }

    return tokens;
  }
}

export default Tokenizer;
