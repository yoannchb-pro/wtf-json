# wtf-json

Parse any kind of broken json for scrapping easily.

## Goal

The primary objective is to ensure error-free parsing of JSON data. This tool enables you to parse any JSON or JavaScript object, regardless of its validity. Whether the input is a valid JSON or not, you can rely on this tool to handle it seamlessly without encountering any errors.

## Install

```
$ npm i @yoannchb/wtf-json
```

Or with the CDN

```html
<script src="https://unpkg.com/@yoannchb/wtf-json@1.0.0/dist/index.js"></script>
```

## Import

Only for nodejs and module script

```js
import wtfJson from "wtf-json";
//or
const wtfJson = require("wtf-json");
```

## Example of brokens JSON with output

```js
wtfJson(
  '{ name Yoann, :"isAdmin":: true,, address: { country: `CA` }, null, {}, "roles": [::,,\'admin\' client, :user], emoji: ":happy:" }'
);
/*
 * Will be parse as follow:
 * {
 *  name: "Yoann",
 *  isAdmin: true,
 *  address: {
 *   country: "CA"
 *  },
 *  roles: ["admin", "client", "user"],
 *  emoji: ":happy:"
 * }
 */

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
 *   data: { id: 6 },s
 *  }
 * ]
 */
```
