import { logger } from "../src/application/logging.js";
import { web } from "../src/application/web.js";
import supertest from "supertest";
import { createTestUser, removeTestUser } from "./test-util.js";

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
})