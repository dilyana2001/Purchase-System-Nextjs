import Item from "models/Item";
import dbConnect from "lib/dbConnect";
import { isAuth } from "middlewares/authorization";

const handler = async(req, res) => {
  await dbConnect();
  
  const { query: { category } } = req;
  
  return Item.find({ category })
    .then((items) => res.status(200).json(items))
    .catch(() =>
      res.status(400).json({ message: "Bad Request!", type: "ERROR" }),
    );
}

export default isAuth(handler);

