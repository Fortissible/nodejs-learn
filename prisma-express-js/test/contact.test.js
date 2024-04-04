import { createManyTestContact, createTestContact, createTestUser, getTestContact, removeTestContact, removeTestUser } from "./test-util.js";
import { web } from "../src/application/web.js";
import supertest from "supertest";
import { logger } from "../src/application/logging.js";

describe("POST /api/contacts", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
  });

  afterEach(async ()=>{
    await removeTestContact();
    await removeTestUser();
  });

  it("should can create new contact", async ()=>{
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization","test")
      .send({
        first_name : "fortissible",
        last_name:"fortissible",
        email:"fortissible@gmail.com",
        phone:"087782695118"
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.first_name).toBe("fortissible");
    expect(result.body.data.last_name).toBe("fortissible");
    expect(result.body.data.email).toBe("fortissible@gmail.com");
    expect(result.body.data.phone).toBe("087782695118");
  });

  it("should reject if request is invalid", async ()=>{
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization","test")
      .send({
        first_name : "",
        last_name:"fortissible",
        email:"fortissible",
        phone:"08778269511812312031259710927509127834091209580912509"
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createTestContact();
  });

  afterEach(async ()=>{
    await removeTestContact();
    await removeTestUser();
  });

  it('should can get contact', async ()=>{
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe(testContact.first_name);
    expect(result.body.data.last_name).toBe(testContact.last_name);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it('should return 404 if contact id not found', async ()=>{
    const testContact = await getTestContact();
    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id+1)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createTestContact();
  });

  afterEach(async ()=>{
    await removeTestContact();
    await removeTestUser();
  });

  it("should can update contact", async ()=>{
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "fortissible_new",
        last_name: "fortissible_new",
        email: "fortissible_new@gmail.com",
        phone: "087782695999"
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.first_name).toBe("fortissible_new");
    expect(result.body.data.last_name).toBe("fortissible_new");
    expect(result.body.data.email).toBe("fortissible_new@gmail.com");
    expect(result.body.data.phone).toBe("087782695999");
  });

  it("should reject if request is invalid", async ()=>{
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id)
      .set("Authorization", "test")
      .send({
        first_name: "",
        last_name: "",
        email: "",
        phone: ""
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should 404 if contact id is not found", async ()=>{
    const testContact = await getTestContact();
    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id+1)
      .set("Authorization", "test")
      .send({
        first_name: "fortissible_new",
        last_name: "fortissible_new",
        email: "fortissible_new@gmail.com",
        phone: "087782695999"
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createTestContact();
  });

  afterEach(async ()=>{
    await removeTestContact();
    await removeTestUser();
  });

  it("should can delete contact", async()=>{
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/"+testContact.id)
      .set("Authorization", "test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  it("should 404 if contact id not found", async()=>{
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/"+testContact.id+1)
      .set("Authorization", "test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createManyTestContact();
  });

  afterEach(async ()=>{
    await removeTestContact();
    await removeTestUser();
  });

  it("should can search without parameter", async()=>{
    const result = await supertest(web)
      .get("/api/contacts")
      .set("Authorization", "test");
    logger.info(result);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  });

  it("should can search to page 2", async()=>{
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        page: 2
      })
      .set("Authorization", "test");
    logger.info(result);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.total_page).toBe(2);
    expect(result.body.paging.total_item).toBe(15);
  })

  it("should can search with name filter", async()=>{
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        name: "fortissible1"
      })
      .set("Authorization", "test");
    logger.info(result);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search with email filter", async()=>{
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        email: "fortissible1"
      })
      .set("Authorization", "test");
    logger.info(result);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search with phone filter", async()=>{
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        phone: "0877826951181"
      })
      .set("Authorization", "test");
    logger.info(result);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });

  it("should can search with all filter (phone,email and name)", async()=>{
    const result = await supertest(web)
      .get("/api/contacts")
      .query({
        phone: "0877826951181",
        name: "fortissible1",
        email: "fortissible1"
      })
      .set("Authorization", "test");
    logger.info(result);
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(6);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.total_page).toBe(1);
    expect(result.body.paging.total_item).toBe(6);
  });
})