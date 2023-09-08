import Purchase from "models/Purchase";
import { isAuth } from "middlewares/authorization";
import dbConnect from "lib/dbConnect";

const handler = async(req, res) => {
  await dbConnect();

  const {
    method,
    query: { number },
  } = req;

  if (method === "DELETE") {
    return Purchase.deleteMany({ numberOfTable: number })
      .then((deleted) => res.status(200).json({ _id: deleted._id }))
      .catch(() => res.status(400).json({ message: "Bad Request!", type: "ERROR" }));
  }
}

export default isAuth(handler);
