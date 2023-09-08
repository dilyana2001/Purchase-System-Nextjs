import Purchase from "models/Purchase";
import dbConnect from "lib/dbConnect";
import { isAuth } from "middlewares/authorization";

const handler = async(req, res) => {
  await dbConnect();
  
  const {
    query: { table },
  } = req;

  return Purchase.find({ numberOfTable: table })
    .sort({ _id: -1 })
    .then((items) => res.status(200).json(items))
    .catch(() =>
      res.status(404).json({ message: "Not Found!", type: "ERROR" })
    );
}

export default isAuth(handler);
