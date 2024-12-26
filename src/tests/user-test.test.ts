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

const user1 = {
  email: "liad@gmail.com",
  username: "liad",
  password: "1q2w3e4r",
  firstName: "Liad",
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

const updatedUserData = {
  firstName: "UpdatedGal",
  lastName: "UpdatedCohen",
};

let _id ="";

describe("All user test", () => {
  //Signup tests
    test("Create a new user", async ()=>{
      const response = await request(app).post("/auth/signup").send(user);
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(user.email);
      expect(response.body.user.username).toBe(user.username);
      expect(response.body.user.firstName).toBe(user.firstName);
      expect(response.body.user.lastName).toBe(user.lastName);
      _id = response.body.user._id;
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

  test("Refresh token", async () => {
    const response = await request(app).post(`/auth/refresh_token`).set('authorization', 'JWT ' + refreshToken);
    expect(response.status).toBe(200);
  });

  test("Refresh token", async () => {
    const response = await request(app).post(`/auth/refresh_token`).set('authorization', 'JWT aaaaaaaaaaaaa');
    expect(response.status).toBe(403);
  });

  //Logout tests
  test("Logout", async ()=>{
    const response = await request(app).post("/auth/logout").set('authorization', 'JWT ' + refreshToken);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logout successful");
  });

  test("Logout with invalid token", async ()=>{
    const response = await request(app).post("/auth/logout").set('authorization', 'JWT aaaaaaaaaaaaaaa');
    expect(response.status).toBe(400);
  });

// Update user tests
test("Update user", async () => {
  const updatedUserData = {
    email: "gal@gmail.com",
    username: "gal",
    firstName: "UpdatedGal",
    lastName: "UpdatedCohen",
    password: "123456",
  };

  const response = await request(app)
    .put(`/auth/${_id}`)       
    .set('authorization', 'JWT ' + accessToken)
    .send(updatedUserData);

  expect(response.status).toBe(200);
  expect(response.body.user.firstName).toBe("UpdatedGal");
  expect(response.body.user.lastName).toBe("UpdatedCohen");
});

test("Update user without authorization", async () => {

  const response = await request(app)
    .put(`/auth/${_id}`)      
    .send(updatedUserData);

  expect(response.status).toBe(401);      
});

test("Update user when user not found", async () => {
  // Create some updated user data
  const updatedUserData = {
    email: "gal@gmail.com",
    username: "gal",
    firstName: "UpdatedGal",
    lastName: "UpdatedCohen",
    password: "123456",
  };

  const invalidUserId = "60c72b2f5f1b2c001fbcf73f";  

  const response = await request(app)
    .put(`/auth/${invalidUserId}`)
    .set('authorization', 'JWT ' + accessToken)  
    .send(updatedUserData);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("User not found");
});


test("Update user with invalid id", async () => {
  const updatedUserData = {
    email: "gal@gmail.com",
    username: "gal",
    firstName: "UpdatedGal",
    lastName: "UpdatedCohen",
    password: "123456",
  };

  const response = await request(app)
    .put(`/auth/45665894}`)      
    .set('authorization', 'JWT ' + accessToken)
    .send(updatedUserData);

  expect(response.status).toBe(500);  
});

})



test("Create another new user", async ()=>{
  const response = await request(app).post("/auth/signup").send(user1);
  expect(response.status).toBe(201);
  expect(response.body.user.email).toBe(user1.email);
  expect(response.body.user.username).toBe(user1.username);
  expect(response.body.user.firstName).toBe(user1.firstName);
  expect(response.body.user.lastName).toBe(user1.lastName);
  _id = response.body.user._id;
});

// Get user tests
test("Get user", async () => {
  const response = await request(app)
    .get(`/auth/${_id}`) 
    .set('authorization', 'JWT ' + accessToken);

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("User found");
  expect(response.body.user.email).toBe(user1.email);
  expect(response.body.user.username).toBe(user1.username);
  expect(response.body.user.firstName).toBe(user1.firstName);
  expect(response.body.user.lastName).toBe(user1.lastName);
});

test("Get a non-existing user", async () => {
  const response = await request(app)
    .get(`/auth/64b6e28f89a8e1d2f8b7d3c9`) 
    .set('authorization', 'JWT ' + accessToken);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("User not found");
});

// Delete user tests
test("Delete an existing user", async () => {

  const response = await request(app)
    .delete(`/auth/${_id}`) 
    .set('authorization', 'JWT ' + accessToken);
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("User deleted successfully");
  expect(response.body.user._id).toBe(_id.toString());
  const deletedUser = await userModel.findById(_id);
  expect(deletedUser).toBeNull();
});


test("Delete user without passing user id", async () => {

  const response = await request(app)
    .delete(`/auth`) 
    .set('authorization', 'JWT ' + accessToken);
  expect(response.status).toBe(404);
});



