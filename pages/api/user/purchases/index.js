import Purchase from "models/Purchase";
import dbConnect from "lib/dbConnect";
import { isAuth } from "middlewares/authorization";

const handler = async(req, res) => {
  await dbConnect();
  const { body, method } = req;

  if (method === "DELETE") {

    return Purchase.deleteMany({})
      .then(() => res.status(200).json({ message: "All purchases deleted successfully!" }))
      .catch((error) =>
        res.status(500).json({ message: "Error deleting purchases", error })
      );
  }

  if (method === "POST") {
    const purchase = new Purchase(body);

    return purchase
      .save()
      .then((createdPurchase) => res.status(201).json({ _id: createdPurchase._id }))
      .catch(() => res.status(400).json({ message: "Bad Request!", type: "ERROR" }));
  }

  return Purchase.find()
    .sort({ _id: -1 })
    .then((items) => res.status(200).json(items))
    .catch(() => res.status(404).json({ message: "Not Found!!", type: "ERROR" }));
}

export default isAuth(handler);

