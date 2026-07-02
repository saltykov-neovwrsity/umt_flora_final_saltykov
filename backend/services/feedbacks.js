import Feedback from "../models/feedback.js";

const getAll = async () => {
  return await Feedback.findAll();
};

const create = async (data) => {
  return await Feedback.create(data);
};

export default {
  getAll,
  create
};
