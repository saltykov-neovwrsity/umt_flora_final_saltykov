import HttpError from "../helpers/HttpError.js";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return next(HttpError(400, `${id} is not a valid integer id`));
  }
  next();
};

export default isValidId;
