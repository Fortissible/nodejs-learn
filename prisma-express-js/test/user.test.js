import { prismaClient } from "../src/application/db.js";
import { logger } from "../src/application/logging.js";
import { web } from "../src/application/web.js";
import supertest from "supertest";

describe("POST /api/users", () => {

  afterEach(async ()=>{
    await prismaClient.user.deleteMany({
      where: {
        username: "fortissible"
      }
    })
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