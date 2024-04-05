import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { createAddressValidation, getAddressValidation, updateAddressValidation } from "../validation/address-validation.js";
import { getContactValidation } from "../validation/contact-validation.js";
import { validate } from "../validation/validation.js";

const checkContactInDb = async (user, contactId)=>{
  contactId = validate(getContactValidation, contactId);

  const totalContactInDb = await prismaClient.contact.count({
    where:{
      username: user.username,
      id: contactId
    }
  });

  if (!totalContactInDb){
    throw new ResponseError(404, "Contact not found");
  }

  return contactId;
}

const create = async (user, contactId, request)=>{
  contactId = await checkContactInDb(user, contactId);

  const address = validate(createAddressValidation, request);

  address.contact_id = contactId;

  return prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true
    }
  });
}

const get = async (user, contactId, addressId)=>{
  contactId = await checkContactInDb(user, contactId);

  addressId = validate(getAddressValidation, addressId);

  const address = await prismaClient.address.findFirst({
    where: {
      contact_id: contactId,
      id: addressId
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true
    }
  });

  if (!address){
    throw new ResponseError(404, "Address not found");
  }

  return address;
}

const update = async (user, contactId, request)=>{
  contactId = await checkContactInDb(user, contactId);

  const address = validate(updateAddressValidation, request);

  const totalAddressInDb = await prismaClient.address.count({
    where: {
      contact_id: contactId,
      id: address.id
    },
  });

  if (!totalAddressInDb){
    throw new ResponseError(404, "Address not found");
  }

  return prismaClient.address.update({
    where:{
      id: address.id
    },
    data:{
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true
    }
  });
}

const remove = async (user, contactId, addressId)=>{
  contactId = await checkContactInDb(user, contactId);
  addressId = validate(getAddressValidation, addressId);

  const totalAddressInDb = await prismaClient.address.count({
    where: {
      contact_id: contactId,
      id: addressId
    },
  });

  if (!totalAddressInDb){
    throw new ResponseError(404, "Address not found");
  }

  return prismaClient.address.delete({
    where:{
      id: addressId
    }
  });
}

const list = async (user, contactId) => {
  contactId = await checkContactInDb(user, contactId);
  return prismaClient.address.findMany({
    where:{
      contact_id: contactId
    },
    select:{
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true
    }
  });
}

export default {
  create,
  get,
  update,
  remove,
  list
}