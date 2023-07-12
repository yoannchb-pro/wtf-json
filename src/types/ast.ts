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

type ASTUndefined = {
  type: "UNDEFINED_VALUE";
  value: undefined;
};

type ASTNaN = {
  type: "NAN_VALUE";
  value: number;
};

type ASTSimple =
  | ASTNull
  | ASTNaN
  | ASTUndefined
  | ASTString
  | ASTBoolean
  | ASTNumber;

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
  | ASTNaN
  | ASTUndefined
  | ASTNumber
  | ASTObject
  | ASTString;

type ASTResult = {
  type: "JSON";
  properties: ASTFinalValue[];
};

type ASTChildren = ASTResult | ASTArray | ASTObjectKey | ASTObject;
type ASTAnyValue =
  | ASTArray
  | ASTBoolean
  | ASTNull
  | ASTNaN
  | ASTUndefined
  | ASTNumber
  | ASTObject
  | ASTString
  | ASTObjectKey;

export {
  ASTArray,
  ASTBoolean,
  ASTNull,
  ASTUndefined,
  ASTNaN,
  ASTNumber,
  ASTObject,
  ASTObjectKey,
  ASTSimple,
  ASTString,
  ASTResult,
  ASTChildren,
  ASTAnyValue,
};
