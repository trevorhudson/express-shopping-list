const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();
const { NotFoundError, BadRequestError } = require("./expressError");





/*
 * Get items: returns list of shopping items as JSON
 */

router.get('/', function (req, res) {

  return res.json({ items: db.items });

});


/**
 * Add an item:
 *
 * Accepts JSON, adds item to database
 * Returns JSON of item
 */
router.post('/', function (req, res) {

  const { name, price } = req.body;
  const item = { name, price };

  db.items.push(item);

  return res.json({ added: item }).status(201);

});

/** Get a single item
 *
 * Returns JSON of item
 */
router.get('/:name', function (req, res) {
  const { name } = req.params;

  for (const item of db.items) {
    if (name === item.name) {
      return res.json(item);
    }
  }

  throw new NotFoundError('Item not found');

});

/** Update an item:
 *
 * Accepts JSON
 * Returns item as JSON
 */

router.patch('/:name', function (req, res) {
  const { name: original } = req.params;
  const { name, price } = req.body;
  const item = { name, price };

  for (const item of db.items) {
    if (original === item.name) {
      item.name = name;
      item.price = price;
      return res.json({ updated: item });
    }
  }

  throw new NotFoundError('Item not found');

});

/** Delete an Item
 * Accepts Query string of item name
 * Returns 'delete message' as JSON if deleted
 * Else returns 404 if not found
 *
 */
router.delete('/:name', function (req, res) {
  const { name } = req.params;

  for (const i = 0; i < db.items.length; i++) {

    if (name === db.items[i].name) {
      db.items.splice(i, 1);
      return res.json({ message: "Deleted" }).status(202);

    }
  }
  throw new NotFoundError('Item not found');

});

















module.exports = router;