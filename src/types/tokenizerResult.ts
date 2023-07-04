type TokenizerResult = {
  type: string;
  value: string;
  startLine: number;
  endLine: number;
  startColumn: number;
  endColumn: number;
};

export default TokenizerResult;
