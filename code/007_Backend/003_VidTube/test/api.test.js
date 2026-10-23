import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";

import { app } from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (!server) return;
  server.close();
  await once(server, "close");
});

const request = (path, options) => fetch(`${baseUrl}/api/v1${path}`, options);

test("healthcheck returns the standard healthy response", async () => {
  const response = await request("/healthcheck/");
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data, "OK");
  assert.equal(body.message, "Server is healthy");
});

test("login rejects missing credentials without contacting the database", async () => {
  const response = await request("/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.message, "Email or username and password are required");
});

test("registration rejects missing fields without contacting external services", async () => {
  const response = await request("/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.message, "All fields are required");
});

test("video listing rejects an invalid user id before querying MongoDB", async () => {
  const response = await request("/videos/user/not-an-object-id");
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.message, "Invalid user id");
});

test("refresh rejects a missing token", async () => {
  const response = await request("/users/refresh-token", { method: "POST" });
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.equal(body.message, "Unauthorized request");
});

test("protected routes reject requests without an access token", async (t) => {
  const protectedRoutes = [
    ["POST", "/users/logout"],
    ["POST", "/users/change-password"],
    ["GET", "/users/current-user"],
    ["GET", "/users/c/test-user"],
    ["PATCH", "/users/update-account"],
    ["PATCH", "/users/avatar"],
    ["PATCH", "/users/cover-image"],
    ["GET", "/users/history"],
    ["POST", "/videos"],
    ["GET", "/videos/507f1f77bcf86cd799439011"],
    ["PATCH", "/videos/507f1f77bcf86cd799439011"],
    ["DELETE", "/videos/507f1f77bcf86cd799439011"],
    ["PATCH", "/videos/507f1f77bcf86cd799439011/publish"],
    ["GET", "/comments/507f1f77bcf86cd799439011"],
    ["POST", "/comments/507f1f77bcf86cd799439011"],
    ["PATCH", "/comments/c/507f1f77bcf86cd799439011"],
    ["DELETE", "/comments/c/507f1f77bcf86cd799439011"],
    ["GET", "/tweets/user/507f1f77bcf86cd799439011"],
    ["POST", "/tweets"],
    ["PATCH", "/tweets/507f1f77bcf86cd799439011"],
    ["DELETE", "/tweets/507f1f77bcf86cd799439011"],
    ["GET", "/subscriptions/c/507f1f77bcf86cd799439011"],
    ["POST", "/subscriptions/c/507f1f77bcf86cd799439011"],
    ["GET", "/subscriptions/u/507f1f77bcf86cd799439011"],
    ["POST", "/playlists"],
    ["GET", "/playlists/user/507f1f77bcf86cd799439011"],
    ["GET", "/playlists/507f1f77bcf86cd799439011"],
    ["PATCH", "/playlists/507f1f77bcf86cd799439011"],
    ["DELETE", "/playlists/507f1f77bcf86cd799439011"],
    ["PATCH", "/playlists/507f1f77bcf86cd799439011/video/507f1f77bcf86cd799439012"],
    ["DELETE", "/playlists/507f1f77bcf86cd799439011/video/507f1f77bcf86cd799439012"],
    ["GET", "/likes/videos"],
    ["POST", "/likes/toggle/v/507f1f77bcf86cd799439011"],
    ["POST", "/likes/toggle/c/507f1f77bcf86cd799439011"],
    ["POST", "/likes/toggle/t/507f1f77bcf86cd799439011"],
    ["GET", "/dashboard/stats"],
    ["GET", "/dashboard/videos"],
  ];

  for (const [method, path] of protectedRoutes) {
    await t.test(`${method} ${path}`, async () => {
      const response = await request(path, { method });
      assert.equal(response.status, 401);
    });
  }
});
