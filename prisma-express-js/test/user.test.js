import { logger } from "../src/application/logging.js";
import { web } from "../src/application/web.js";
import supertest from "supertest";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {

  afterEach(async ()=>{
    await removeTestUser();
  })

  it("should can register new user", async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'fortissible',
        password: 'fortissible',
        name: 'fortissible'
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fortissible");
    expect(result.body.data.password).toBe(undefined);
    expect(result.body.data.name).toBe("fortissible");
  })

  it("should reject if request invalid", async () => {
    const result = await supertest(web)
      .post('/api/users')
      .send({
        username: '',
        password: '',
        name: ''
      });
    
    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  })

  it("should reject if username already exist (duplicate)", async () => {
    let result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'fortissible',
        password: 'fortissible',
        name: 'fortissible'
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fortissible");
    expect(result.body.data.password).toBe(undefined);
    expect(result.body.data.name).toBe("fortissible");

    result = await supertest(web)
      .post('/api/users')
      .send({
        username: 'fortissible',
        password: 'fortissible',
        name: 'fortissible'
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  })
})

describe("POST /api/users/login", ()=>{
  beforeEach( async ()=>{
    await createTestUser();
  });

  afterEach( async ()=>{
    await removeTestUser();
  });

  it('should can login', async() => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: "fortissible",
        password: "fortissible"
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe('test');
  });

  it('should reject login if request is invalid', async() => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: "",
        password: ""
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject login if password or username is wrong', async() => {
    const result = await supertest(web)
      .post('/api/users/login')
      .send({
        username: "fortissible",
        password: "wrong_pass"
      });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users/current", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
  });

  afterEach(async ()=>{
    await removeTestUser();
  });

  it("should can get current user", async ()=>{
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'test');

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fortissible");
    expect(result.body.data.name).toBe("fortissible");
  });

  it("should can reject if token is invalid", async ()=>{
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'wrong_token');

    expect(result.status).toBe(401);
    expect(result.body.errors).toBe("Unauthorized");
  })
});

describe("PATCH /api/users/current", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
  });

  afterEach(async ()=>{
    await removeTestUser();
  });

  it("should can update user name and password", async ()=>{
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "UpdatedFortissible",
        password: "UpdatedPassword"
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fortissible");
    expect(result.body.data.name).toBe("UpdatedFortissible");

    const user = await getTestUser();
    expect(await bcrypt.compare("UpdatedPassword", user.password)).toBe(true);
  });

  it("should can update user name only", async ()=>{
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        name: "UpdatedFortissible",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fortissible");
    expect(result.body.data.name).toBe("UpdatedFortissible");
  });

  it("should can update user password only", async ()=>{
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "test")
      .send({
        password: "UpdatedPassword",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("fortissible");
    expect(result.body.data.name).toBe("fortissible");

    const user = await getTestUser();

    expect(await bcrypt.compare("UpdatedPassword", user.password)).toBe(true);
  });

  it("should reject if request is not valid", async ()=>{
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "token_salah")
      .send({
        password: "UpdatedPassword",
      });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/logout", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
  });

  afterEach(async ()=>{
    await removeTestUser();
  });

  it("should can logout", async ()=>{
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "test")
    
    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const user = await getTestUser();
    expect(user.token).toBe(null);
  });

  it("should reject logout if request invalid", async ()=>{
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "token_salah")
    
    expect(result.status).toBe(401);
  });
});