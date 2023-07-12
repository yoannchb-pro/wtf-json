# wtf-json

Parse any kind of broken json for scrapping easily.

## Goal

The primary objective is to ensure error-free parsing of JSON data. This tool enables you to parse any JSON or JavaScript object, regardless of its validity. Whether the input is a valid JSON or not, you can rely on this tool to handle it seamlessly without encountering any errors.

## Update

See the [CHANGELOG](./CHANGELOG.md)

## Install

```
$ npm i @yoannchb/wtf-json
```

Or with the CDN

```html
<script src="https://unpkg.com/@yoannchb/wtf-json@1.0.5/dist/index.js"></script>
```

## Import

Only for nodejs and module script

```js
import wtfJson from "wtf-json";
//or
const wtfJson = require("wtf-json");
```

## Type

By default wtfJson return an `any` type but you can use generic type

```ts
wtfJson<{ id: number }>("{ id: 6 }").id; //autocompletion work and id is a number :)
```

## Examples of use

### Parse simple JSON

```js
wtfJson(
  '{ "name": "Will", "age": 21, "favorite-food": ["Matcha", "Dumpling"] }'
);
/*
 * Will be parse as follow:
 * {
 *  name: "Will",
 *  age: 21,
 *  favorite-food: ["Matcha", "Dumpling"]
 * }
 */
```

### Parse JS object

```js
wtfJson(
  '{ note: 20, coefficient: .5, student: "Lili", comments: [{ by: "Teacher 1", comment: "Good Job!" }], courses: undefined }'
);
/*
 * Will be parse as follow:
 * {
 *  note: 20,
 *  coefficient: 0.5,
 *  student: "Lili"
 *  comments: [{ by: "Teacher 1", comment: "Good Job!" }],
 *  courses: undefined
 * }
 */
```

### Parse broken JSON

```js
wtfJson(
  '{ name Yoann, :"isAdmin":: true,, address: { country: `CA` }, null, {}, "roles": [::,,\'admin\' client, :user] }'
);
/*
 * Will be parse as follow:
 * {
 *  name: "Yoann",
 *  isAdmin: true,
 *  address: {
 *   country: "CA"
 *  },
 *  roles: ["admin", "client", "user"]
 * }
 */
```

### Parse multiples broken JSON

```js
wtfJson(`null,null
,null,\\n
{ data: [{ "id": 6 }] }`);
/*
 * Will be parse as follow:
 * [
 *  null,
 *  null,
 *  null,
 *  "\n",
 *  {
 *   data: { id: 6 }
 *  }
 * ]
 */
```
