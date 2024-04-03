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

export {
  createTestUser, 
  removeTestUser
}