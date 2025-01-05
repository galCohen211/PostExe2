import request from "supertest";
import App from "../server";
import mongoose from "mongoose";
import postModel from "../models/post-model";
import { Express } from "express";

let app: Express;
let accessToken: String;
let refreshToken: String;
let postId: String;

beforeAll(async () => {
  app = await App();
  const response = await request(app).post("/auth/login").send({
    username: "gal",
    password: "123456"
    });
    expect(response.status).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  await postModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

const new_post = {
  title: "Oriya new post",
  content: "this is Oriya's post",
  owner: "oriyap"
}

const incomplete_post = {
  title: "Oriya new post",
  content: "this is Oriya's post"
}

describe("All post tests", () => {
   
    test("Create a new post", async ()=>{
      const response = await request(app).post("/post/").send(new_post).set('auth', 'JWT ' + accessToken);
      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Oriya new post");
      expect(response.body.content).toBe("this is Oriya's post");
      expect(response.body.owner).toBe("oriyap");
      postId = response.body._id;
  });

  test("Create a new post without all fields", async ()=>{
    const response = await request(app).post("/post/").send(incomplete_post).set('auth', 'JWT ' + accessToken);
    expect(response.status).toBe(500);
});

  test("Get a post by id", async ()=>{
    const response = await request(app).get("/post/" + postId);
    expect(response.status).toBe(200);
  });

  test("Get a post with invalid id", async ()=>{
    const response = await request(app).get("/post/aaaaaa");
    expect(response.status).toBe(500);
  });

  test("Get all posts", async ()=>{
    const response = await request(app).get("/post");    
    expect(response.status).toBe(200);
  });

  test("update a post", async ()=>{
    const response = await request(app).put("/post/" + postId).send("This is the new content").set('auth', 'JWT ' + accessToken);    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Post updated");
  });

  test("update a post with invalid id", async ()=>{
    const response = await request(app).put("/post/aaaaaa").send("This is the new content").set('auth', 'JWT ' + accessToken);    
    expect(response.status).toBe(500);
  });


  test("Delete post", async ()=>{
    const response = await request(app).delete("/post/" + postId).set('auth', 'JWT ' + accessToken);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Post deleted");
  });

  test("Delete post with invalid id", async ()=>{
    const response = await request(app).delete("/post/aaaaaa").set('auth', 'JWT ' + accessToken);
    expect(response.status).toBe(500);
  });
})