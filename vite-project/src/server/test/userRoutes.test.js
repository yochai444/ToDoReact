import request from "supertest";
import { connectDb, getDb } from "../db.js";
import { createServer } from "../server.js";

beforeAll(async () => {
  await connectDb();
});

afterAll(async () => {
  const db = getDb();
  //await db.dropDatabase();
  await db.client.close();
});

describe("User Routes", () => {
  const newUser = {
    _id: 1000,
    name: "Moshel",
    email: "yochai4",
    password: "gjdj",
  };
  it("should create a new user", async () => {
    const response = await request(createServer())
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send(newUser);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  it("should update the user partially", async () => {
    const updateData = {
      name: "Jane Doe",
    };

    const response = await request(createServer())
      .patch(`/api/users/1000`)
      .set("Content-Type", "application/json")
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.text).toBe("User updated successfully");

    const db = getDb();
    const updatedUser = await db.collection("users").findOne({ _id: 1000 });
    expect(updatedUser.name).toBe(updateData.name);
  });
});
