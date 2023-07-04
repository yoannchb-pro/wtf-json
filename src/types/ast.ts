type ASTBoolean = {
  type: "BOOLEAN";
  value: boolean;
};

type ASTString = {
  type: "STRING";
  value: string;
};

type ASTNumber = {
  type: "NUMBER";
  value: number;
};

type ASTNull = {
  type: "NULL_VALUE";
  value: null;
};

type ASTSimple = ASTNull | ASTString | ASTBoolean | ASTNumber;

type ASTObjectKey = {
  type: "OBJECT_KEY";
  name: string;
  value: ASTSimple;
};

type ASTObject = {
  type: "OBJECT";
  properties: ASTObjectKey[];
};

type ASTArray = {
  type: "ARRAY";
  properties: ASTSimple[];
};

type ASTFinalValue =
  | ASTArray
  | ASTBoolean
  | ASTNull
  | ASTNumber
  | ASTObject
  | ASTString;

type ASTResult = {
  type: "JSON";
  value: ASTFinalValue;
};

type ASTChildren = ASTResult | ASTArray | ASTObjectKey | ASTObject;
type ASTAnyValue =
  | ASTArray
  | ASTBoolean
  | ASTNull
  | ASTNumber
  | ASTObject
  | ASTString
  | ASTObjectKey;

export {
  ASTArray,
  ASTBoolean,
  ASTNull,
  ASTNumber,
  ASTObject,
  ASTObjectKey,
  ASTSimple,
  ASTString,
  ASTResult,
  ASTChildren,
  ASTAnyValue,
};
