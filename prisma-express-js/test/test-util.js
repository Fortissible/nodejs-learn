import { prismaClient } from "../src/application/db.js";
import bcrypt from 'bcrypt';
const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "fortissible"
    }
  });
}

const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'fortissible',
      password: await bcrypt.hash('fortissible', 10),
      name: 'fortissible',
      token: 'test'
    }
  })
}

const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: "fortissible"
    }
  });
}

const removeTestContact = async ()=>{
  return prismaClient.contact.deleteMany({
    where: {
      username: 'fortissible'
    }
  });
}

const createTestContact = async () => {
  return prismaClient.contact.create({
    data: {
      username: "fortissible",
      first_name: "fortissible",
      last_name: "fortissible",
      email: "fortissible@gmail.com",
      phone: "087782695118"
    }
  });
} 

const createManyTestContact = async ()=>{
  for (let i=0; i<15; i++){
    await prismaClient.contact.create({
      data: {
        username: `fortissible`,
        first_name: `fortissible${i}`,
        last_name: `fortissible${i}`,
        email: `fortissible${i}@gmail.com`,
        phone: `087782695118${i}`
      }
    });
  }
}

const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: "fortissible",
    }
  });
} 

const removeAllTestAddress = async ()=>{
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: "fortissible"
      }
    }
  })
}

const createTestAddress = async ()=>{
  const contact = await getTestContact();
  await prismaClient.address.create({
    data: {
      contact_id: contact.id,
      street: "fortissible street",
      city: "fortissible city",
      province: "fortissible province",
      country: "fortissible country",
      postal_code: "18870"
    }
  });
}

const getTestAddress = async ()=>{
  return prismaClient.address.findFirst({
    where:{
      contact: {
        username: "fortissible"
      }
    }
  })
}

export {
  createTestUser, 
  removeTestUser,
  getTestUser,
  removeTestContact,
  createTestContact,
  getTestContact,
  createManyTestContact,
  removeAllTestAddress,
  createTestAddress,
  getTestAddress
}