import request from "supertest";
import App from "../server";
import mongoose from "mongoose";
import commentModel from "../models/comment-model";
import postModel from "../models/post-model";
import { Express } from "express";

let app: Express;
let accessToken = '';
let refreshToken = '';

beforeAll(async () => {
  app = await App();
    const response = await request(app).post("/auth/login").send({
      username: "gal",
      password: "123456"
      });
      expect(response.status).toBe(200);
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
  await commentModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

const post = {
  _id: "60f1b9b3b3f3f3f3f3f3f3f3",
  title: "Gal new post",
  content: "This is Gal's post",
  owner: "Gal"
};

const newComment = {
  owner: "gal",
  content: "This is a test comment.",
  postId: post._id
};

let commentId="";

describe("Comment Controller Tests", () => {

  
  // Create a new comment
  test("Create a new comment", async () => {
    const response = await request(app)
      .post("/comment/")
      .send(newComment)
      .set("Authorization", "JWT " + accessToken);

    expect(response.status).toBe(201);
    expect(response.body.owner).toBe(newComment.owner);
    expect(response.body.content).toBe(newComment.content);
    expect(response.body.postId).toBe(newComment.postId);

    commentId = response.body._id; 
  });

  // Get a comment by ID
  test("Get a comment by ID", async () => {
    const response = await request(app).get(`/comment/${commentId}`);

    expect(response.status).toBe(200);
    expect(response.body.commentById._id).toBe(commentId);
    expect(response.body.commentById.owner).toBe(newComment.owner);
  });

  // Get comments by post ID
  test("Get comments by post ID", async () => {
    const response = await request(app).get(`/comment/post/${post._id}`);

    expect(response.status).toBe(200);
    expect(response.body.commentByPostId).toHaveLength(1);
    expect(response.body.commentByPostId[0]._id).toBe(commentId);
  });

  // Get all comments
  test("Get all comments", async () => {
    const response = await request(app).get("/comment/");

    expect(response.status).toBe(200);
    expect(response.body.comments).toHaveLength(1);
    expect(response.body.comments[0]._id).toBe(commentId);
  });

  // Update a comment
  test("Update a comment", async () => {
    const updatedContent = { content: "This is updated content." };

    const response = await request(app)
      .put(`/comment/${commentId}`)
      .send(updatedContent)
      .set("Authorization", "JWT " + accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment updated");
    expect(response.body.updateContent.content).toBe("This is updated content.");
  });

  // Delete a comment
  test("Delete a comment", async () => {
    const response = await request(app)
      .delete(`/comment/${commentId}`)
      .set("Authorization", "JWT " + accessToken);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment deleted");

    // Ensure comment is deleted from database
    const deletedComment = await commentModel.findById(commentId);
    expect(deletedComment).toBeNull();
  });
});
