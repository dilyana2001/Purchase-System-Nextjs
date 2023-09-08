import Item from "models/Item";
import dbConnect from "lib/dbConnect";
import { isAuth } from "middlewares/authorization";

const handler = async(req, res) => {
  await dbConnect();
  
  const {
    query: { itemId },
  } = req;
  
  return Item.findById(itemId)
    .sort({ _id: -1 })
    .then((item) => res.status(200).json(item))
    .catch(() =>
      res.status(404).json({ message: "Not Found!", type: "ERROR" })
    );
}

export default isAuth(handler);
