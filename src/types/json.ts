type JSONPrimitif = string | number | boolean | null;

type JSONObject = {
  [key: string]: JSONResult;
};

type JSONArray = JSONResult[];

type JSONResult = JSONObject | JSONArray | JSONPrimitif;

export { JSONResult, JSONArray, JSONObject, JSONPrimitif };
