"use strict";

const request = require("supertest");
const app = require("./app");
const db = require("./fakeDb");

beforeEach(function () {});

afterEach(function () {
  db.items = [
    { name: "popsicle", price: 1.45 },
    { name: "cheerios", price: 3.4 },
  ];
});

describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual({
      items: [
        { name: "popsicle", price: 1.45 },
        { name: "cheerios", price: 3.4 },
      ],
    });
  });
});

describe("POST /items", function () {
  it("Add an item and returns it", async function () {
    expect(db.items.length).toEqual(2);

    const resp = await request(app)
      .post(`/items`)
      .send({ name: "cheetos", price: 3.0 });

    expect(resp.body).toEqual({
      added: {
        name: "cheetos",
        price: 3.0,
      },
    });

    expect(db.items.length).toEqual(3);
  });

  it("Adding an item without a name or price should throw", async function () {
    const resp = await request(app).post(`/items`).send({ name: "cheetos" });

    expect(resp.statusCode).toEqual(400);
  });
});

describe("GET /items/:item", function () {
  it("Returns a single item", async function () {
    const resp = await request(app).get(`/items/popsicle`);
    expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
  });

  it("Should fail if item not found", async function () {
    expect((await request(app).get(`/items/caviar`)).statusCode).toEqual(404);
  });
});

describe("PATCH /items/:item", function () {
  it("Accepts a JSON body, modifies item, returns it, or throws", async function () {
    const resp = await request(app)
      .patch(`/items/popsicle`)
      .send({ name: "popsicle 2" });

    // TODO: FIX THIS
    expect(resp.body).toEqual({ updated: { name: "popsicle 2", price: 1.45 } });

    expect(db.items.find((item) => item.name === "popsicle 2")).toEqual({
      name: "popsicle 2",
      price: 1.45,
    });
  });

  it("Should fail if item not found", async function () {
    const resp = await request(app)
      .patch(`/items/caviar`)
      .send({ name: "popsicle 2", price: 10 });

    expect(resp.statusCode).toEqual(404);
  });
});

describe("DELETE /items/:item", function () {
  it("Deletes an item with name matching :item", async function () {
    expect(db.items.length).toEqual(2);

    const resp = await request(app).delete(`/items/popsicle`);

    expect(resp.body).toEqual({ message: "Deleted" });

    expect(db.items.length).toEqual(1);
  });

  it("Should fail if item not found", async function () {
    const resp = await request(app).delete(`/items/caviar`);

    expect(resp.statusCode).toEqual(404);
  });
});
