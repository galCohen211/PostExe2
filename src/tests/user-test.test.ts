import request from "supertest";
import App from "../server";
import mongoose from "mongoose";
import userModel from "../models/user-model";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await App();
  await userModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

const user = {
  email: "gal@gmail.com",
  username: "gal",
  password: "123456",
  firstName: "Gal",
  lastName: "Cohen"
}

const invalidUser = {
  username: "gal"
}

describe("All user test", () => {
    test("Create a new user", async ()=>{
        const response = await request(app).post("/user/signup").send(user);    
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe("gal@gmail.com");
      expect(response.body.user.username).toBe("gal");
      expect(response.body.user.firstName).toBe("Gal");
      expect(response.body.user.lastName).toBe("Cohen");
  });

  test("Create a new user with missing fields", async ()=>{
    const response = await request(app).post("/user/signup").send(invalidUser);    
    expect(response.status).toBe(400);
  });


})