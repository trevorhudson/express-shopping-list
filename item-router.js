"use strict";

const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();
const { NotFoundError, BadRequestError } = require("./expressError");

/*
 * Get items: returns list of shopping items as JSON
 */

router.get("/", function (req, res) {
  return res.json({ items: db.items });
});

/**
 * Add an item:
 *
 * Accepts JSON {name, price}, adds item to database TODO
 * Returns JSON of item
 */
router.post("/", function (req, res) {
  const { name, price } = req.body;

  if (name && price) {
    const item = { name, price };

    db.items.push(item);

    return res.json({ added: item }).status(201);
  }

  throw new BadRequestError();
});

/** Get a single item
 *
 * Returns JSON of item
 */
router.get("/:name", function (req, res) {
  const { name } = req.params;

  for (const item of db.items) {
    if (name === item.name) {
      return res.json(item);
    }
  }

  throw new NotFoundError("Item not found");
});

/** Update an item:
 * Accepts JSON
 * Returns item as JSON
 */

router.patch("/:name", function (req, res) {
  const { name, price } = req.body;

  const foundItem = db.items.find((item) => item.name === original);

  if (foundItem) {
    if (foundItem.name !== name) {
      foundItem.name = name;
    }

    if (foundItem.price !== price) {
      foundItem.price = price;
    }

    return res.json({ updated: foundItem });
  }

  throw new NotFoundError("Item not found");
});

/** Delete an Item
 * Accepts Query string of item name
 * Returns 'delete message' as JSON if deleted
 * Else returns 404 if not found
 */
router.delete("/:name", function (req, res) {
  const { name } = req.params;

  const itemIdx = db.items.findIndex((item) => item.name === name);

  if (itemIdx !== -1) {
    db.items.splice(itemIdx, 1);

    return res.json({ message: "Deleted" });
  }

  throw new NotFoundError("Item not found");
});

module.exports = router;
