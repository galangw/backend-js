const axios = require('axios');
const path = require('path');
const prisma = require('../../prisma/prismaClient');

async function getAllFrame() {
  console.log(path.join(__dirname, '..', 'images'));
  const result = await prisma.frame.findMany({
    select: {
      name: true,
      urlPicture: true,
      gender: true,
      face: true,
    },
  });

  return result;
}

async function getAllFrameByQuery(gender, picture) {
  // your fetch api from python BE
  const response = await axios.post('http://pppp/predict');
  const { face } = response;

  const result = await prisma.frame.findMany({
    where: {
      face,
      gender,
    },
  });

  return result;
}

async function getFrame(id) {
  const result = await prisma.frame.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      name: true,
      urlPicture: true,
      linkBuy: true,
      gender: true,
      face: true,
    },
  });

  if (!result) {
    throw new Error('frame not found');
  }

  return result;
}

async function createFrame(req, path) {
  const {
    name, linkBuy, face, gender,
  } = req.body;
  const urlPicture = path;
  console.log(urlPicture);
  const data = {
    name,
    urlPicture,
    linkBuy,
    face: face.toUpperCase(),
    gender: gender.toUpperCase(),
  };
  const result = await prisma.frame.create({
    data: {
      ...data,
    },
    select: {
      name: true,
      urlPicture: true,
      linkBuy: true,
      gender: true,
      face: true,
    },
  });

  return result;
}

async function updateFrame(id, body) {
  const {
    name, linkBuy, urlPicture, face, gender,
  } = body;

  const checkExistFrame = await getFrame(id);

  if (!checkExistFrame) {
    throw new Error('Frame Not Found');
  }

  const data = {
    name,
    urlPicture,
    linkBuy,
    face: face.toUpperCase(),
    gender: gender.toUpperCase(),
  };

  const result = await prisma.frame.update({
    where: { id },
    data: { ...data },
  });

  if (!result) {
    throw new Error('error update');
  }

  return result;
}

module.exports = {
  getAllFrame,
  getFrame,
  createFrame,
  updateFrame,
  getAllFrameByQuery,
};
