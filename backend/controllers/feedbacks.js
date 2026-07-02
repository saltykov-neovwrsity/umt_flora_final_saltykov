import feedbacksService from "../services/feedbacks.js";

const getAll = async (req, res) => {
  const result = await feedbacksService.getAll();
  res.json(result);
};

const create = async (req, res) => {
  const result = await feedbacksService.create(req.body);
  res.status(201).json(result);
};

export default {
  getAll,
  create
};
