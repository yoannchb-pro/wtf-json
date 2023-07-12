# wtf-json

Parse any kind of broken json for scrapping easily. The goal is to never get any error when parsing your JSON.

## Install

```
$ npm i @yoannchb/wtf-json
```

Or with the CDN

```html
<script src="https://unpkg.com/@yoannchb/wtf-json@1.0.0/dist/index.js"></script>
```

## Import

```js
import wtfJson from "wtf-json";
//or
const wtfJson = require("wtf-json");
```

## Usage

```js
wtfJson(
  '{ name: Yoann, "isAdmin":: true, address: { country: `CA` }, null, "roles": [::,,"admin", client, :user] }'
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
