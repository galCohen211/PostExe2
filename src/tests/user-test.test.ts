import request from "supertest";
import App from "../server";
import mongoose from "mongoose";
import userModel from "../models/user-model";
import { Express } from "express";

let app: Express;
let accessToken = '';
let refreshToken = '';

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

const usernameExist = {
  email: "ron@gmail.com",
  username: "gal",
  password: "123456",
  firstName: "Ron",
  lastName: "Cohen"
}

describe("All user test", () => {
  //Signup tests
    test("Create a new user", async ()=>{
      const response = await request(app).post("/auth/signup").send(user);
      console.log(response);
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe("gal@gmail.com");
      expect(response.body.user.username).toBe("gal");
      expect(response.body.user.firstName).toBe("Gal");
      expect(response.body.user.lastName).toBe("Cohen");
  });

  test("Create a new user with missing fields", async ()=>{
    const response = await request(app).post("/auth/signup").send(invalidUser);    
    expect(response.status).toBe(400);
  });

  test("Create a new user that the email already exists", async ()=>{
    const response = await request(app).post("/auth/signup").send(user);    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already exists");
  });

  test("Create a new user that the username already exists", async ()=>{
    const response = await request(app).post("/auth/signup").send(usernameExist);    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username already exists");
  });

  //Login tests

  test("Login with exist user", async ()=>{
    const response = await request(app).post("/auth/login").send({
        username: "gal",
        password: "123456"
    })
    expect(response.status).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  test("Login with not exist user", async ()=>{
    const response = await request(app).post("/auth/login").send({
        username: "gal1111@gmail.com",
        password: "123456"
      })
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Incorrect email or password, please try again");
  });

  test ("Login with wrong password", async ()=>{
    const response = await request(app).post("/auth/login").send({
        username: "gal",
        password: "1234567"
    })
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Incorrect email or password, please try again");
  });

  //Logout tests
  test("Logout", async ()=>{
    const response = await request(app).post("/user/logout");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("You are logged out");
  });
})