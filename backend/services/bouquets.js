import Bouquet from "../models/bouquet.js";

const getAll = async (query = {}) => {
  const { _page, _per_page } = query;
  
  if (_page && _per_page) {
    const page = parseInt(_page, 10) || 1;
    const limit = parseInt(_per_page, 10) || 4;
    const offset = (page - 1) * limit;

    const { rows, count } = await Bouquet.findAndCountAll({
      offset,
      limit,
      order: [["id", "ASC"]]
    });

    const hasNext = offset + limit < count;

    return {
      data: rows,
      next: hasNext ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
      pages: Math.ceil(count / limit),
      items: count
    };
  }

  return Bouquet.findAll({
    order: [["id", "ASC"]]
  });
};

const getById = async (id) => {
  return Bouquet.findByPk(id);
};

const create = async (data) => {
  return Bouquet.create(data);
};

const update = async (id, data) => {
  const bouquet = await Bouquet.findByPk(id);
  if (!bouquet) {
    return null;
  }
  return bouquet.update(data);
};

const remove = async (id) => {
  const bouquet = await Bouquet.findByPk(id);
  if (!bouquet) {
    return null;
  }
  await bouquet.destroy();
  return bouquet;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove
};
