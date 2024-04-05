import supertest from "supertest";
import { createTestUser, removeTestContact, removeTestUser, createTestContact, removeAllTestAddress, getTestContact, createTestAddress, getTestAddress} from "./test-util";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/contacts/:contactId/addresses", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createTestContact();
  });

  afterEach(async ()=>{
    await removeAllTestAddress();
    await removeTestContact();
    await removeTestUser();
  });

  it('should create new address', async()=>{
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post('/api/contacts/'+testContact.id+'/addresses')
      .set("Authorization",'test')
      .send({
        street: "fortissible street",
        city: "fortissible city",
        province: "fortissible province",
        country: "fortissible country",
        postal_code: "18870"
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("fortissible street");
    expect(result.body.data.city).toBe("fortissible city");
    expect(result.body.data.province).toBe("fortissible province");
    expect(result.body.data.country).toBe("fortissible country");
    expect(result.body.data.postal_code).toBe("18870");
  });

  it('should reject when the body data is invalid', async()=>{
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post('/api/contacts/'+testContact.id+'/addresses')
      .set("Authorization",'test')
      .send({
        street: "fortissible street",
        city: "fortissible city",
        province: "fortissible province",
        country: "",
        postal_code: ""
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it('should reject when contact id not found', async()=>{
    const testContact = await getTestContact();

    const result = await supertest(web)
      .post('/api/contacts/'+ (testContact.id + 1) +'/addresses')
      .set("Authorization",'test')
      .send({
        street: "fortissible street",
        city: "fortissible city",
        province: "fortissible province",
        country: "fortissible country",
        postal_code: "18870"
      });

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", ()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async ()=>{
    await removeAllTestAddress();
    await removeTestContact();
    await removeTestUser();
  });

  it("should get the address", async()=>{
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization","test");

    logger.info(result);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.street).toBe("fortissible street");
    expect(result.body.data.city).toBe("fortissible city");
    expect(result.body.data.province).toBe("fortissible province");
    expect(result.body.data.country).toBe("fortissible country");
    expect(result.body.data.postal_code).toBe("18870");
  });

  it("should reject if contact is not found", async()=>{
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id+1) + "/addresses/" + testAddress.id)
      .set("Authorization","test");

    logger.info(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if address is not found", async()=>{
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id + 1)
      .set("Authorization","test");

    logger.info(result);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/contacts/:contactId/addresses/:addressId",()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async ()=>{
    await removeAllTestAddress();
    await removeTestContact();
    await removeTestUser();
  });

  it("should can update address", async()=>{
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization","test")
      .send({
        street: "fortissible street updated",
        city: "fortissible city updated",
        province: "fortissible province updated",
        country: "fortissible country updated",
        postal_code: "18871"
      });

      expect(result.status).toBe(200);
      expect(result.body.data.id).toBe(testAddress.id);
      expect(result.body.data.street).toBe("fortissible street updated");
      expect(result.body.data.city).toBe("fortissible city updated");
      expect(result.body.data.province).toBe("fortissible province updated");
      expect(result.body.data.country).toBe("fortissible country updated");
      expect(result.body.data.postal_code).toBe("18871");
  });

  it("should can reject if request invalid", async()=>{
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization","test")
      .send({
        street: "fortissible street updated",
        city: "fortissible city updated",
        province: "fortissible province updated",
        country: "",
        postal_code: ""
      });

      expect(result.status).toBe(400);
      expect(result.body.errors).toBeDefined();
  });

  it("should can reject if contact id not found", async()=>{
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id + 1)
      .set("Authorization","test")
      .send({
        street: "fortissible street updated",
        city: "fortissible city updated",
        province: "fortissible province updated",
        country: "fortissible country updated",
        postal_code: "18871"
      });

      expect(result.status).toBe(404);
      expect(result.body.errors).toBeDefined();
  });

  it("should can reject if address id not found", async()=>{
    const testContact = await getTestContact();
    const testAddress = await getTestAddress();

    const result = await supertest(web)
      .put("/api/contacts/" + testContact.id + 1 + "/addresses/" + testAddress.id)
      .set("Authorization","test")
      .send({
        street: "fortissible street updated",
        city: "fortissible city updated",
        province: "fortissible province updated",
        country: "fortissible country updated",
        postal_code: "18871"
      });

      expect(result.status).toBe(404);
      expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId",()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async ()=>{
    await removeAllTestAddress();
    await removeTestContact();
    await removeTestUser();
  });

  it("should can remove address", async()=>{
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id)
      .set("Authorization","test");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    testAddress = await getTestAddress();
    expect(testAddress).toBeNull();
  });

  it("should reject if address id not found", async()=>{
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id + "/addresses/" + testAddress.id + 1)
      .set("Authorization","test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if contact id not found", async()=>{
    const testContact = await getTestContact();
    let testAddress = await getTestAddress();

    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id + 1 + "/addresses/" + testAddress.id)
      .set("Authorization","test");

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId/addresses",()=>{
  beforeEach(async ()=>{
    await createTestUser();
    await createTestContact();
    await createTestAddress();
  });

  afterEach(async ()=>{
    await removeAllTestAddress();
    await removeTestContact();
    await removeTestUser();
  });

  it("should get all list of address by valid contactId", async()=>{
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id + "/addresses")
      .set("Authorization","test")
    
    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  it("should reject if contactId not found", async()=>{
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id+1 + "/addresses")
      .set("Authorization","test")
    
    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});