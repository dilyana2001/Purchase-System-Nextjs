import Item from "models/Item";
import dbConnect from "lib/dbConnect";
import { isAuth } from "middlewares/authorization";

const handler = async(req, res) => {
  await dbConnect();

  return Item.find({})
    .sort({ _id: -1 })
    .then((items) => res.status(200).json(items))
    .catch(() =>
      res.status(404).json({ message: "Not Found!", type: "ERROR" })
    );
}

export default isAuth(handler);
