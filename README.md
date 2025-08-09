# response-modifier

**response-modifier** is a lightweight and configurable Express middleware for modifying API responses before they are sent to the client.  
It supports:

- **Renaming keys** (e.g. `_id` → `id`)
- **Removing keys** (e.g. `password` → removed)
- Works recursively on nested objects and arrays
- Written in **TypeScript** with full type definitions

---

## Installation

```bash
npm i @moka97/response-modifier
```

---

## Usage

### Basic Example

```ts
import express from "express";
import { createResponseModifierMiddleware } from "response-modifier";

const app = express();

app.use(
  createResponseModifierMiddleware({
    renames: { _id: "id" }, // rename _id to id
    removes: ["password"], // remove password key
  })
);

app.get("/", (req, res) => {
  res.json({
    _id: "123",
    username: "mobin",
    password: "secret",
    nested: { _id: "nested123", password: "nestedSecret" },
    items: [
      { _id: "item1", password: "pass1" },
      { _id: "item2", password: "pass2" },
    ],
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

**Output:**

```json
{
  "id": "123",
  "username": "mobin",
  "nested": { "id": "nested123" },
  "items": [{ "id": "item1" }, { "id": "item2" }]
}
```

---

## API

### `createResponseModifierMiddleware(options)`

Creates an Express middleware that modifies the response object before sending.

#### Parameters

| Name      | Type                      | Description           |
| --------- | ------------------------- | --------------------- |
| `options` | `ResponseModifierOptions` | Configuration options |

```ts
interface ResponseModifierOptions {
  // - Keys to rename in the response
  // - Example: { _id: "id" }
  renames?: Record<string, string>;

  // - Keys to remove from the response
  // - Example: ["password", "secretKey"]
  removes?: string[];
}
```

---

## Features

- Works recursively on deeply nested objects and arrays.
- Non-destructive: returns a new modified object.
- TypeScript-ready with full definitions.
- Supports both CommonJS (`require`) and ES modules (`import`).

---

## License

MIT License © 2025
