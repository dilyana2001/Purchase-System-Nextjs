import Purchase from "models/Purchase";
import dbConnect from "lib/dbConnect";
import { isAuth } from "middlewares/authorization";

const handler = async(req, res) => {
  await dbConnect();

  const {
    method,
    query: { itemId },
    body,
  } = req;

  
  if (method === "PUT") {
    const purchase = new Purchase({ _id: itemId, ...body });
    return Purchase.findByIdAndUpdate(itemId, purchase)
      .then((updated) => res.status(201).json({ _id: updated._id }))
      .catch(() =>
        res.status(403).json({ message: "Forbidden!", type: "ERROR" })
      );
  } else if (method === "DELETE") {
    return Purchase.findByIdAndRemove(itemId)
      .then((deleted) => res.status(200).json({ _id: deleted._id }))
      .catch(() =>
        res.status(403).json({ message: "Forbidden!", type: "ERROR" })
      );
  } 

  return Purchase.findById(itemId)
    .then((item) => res.status(200).json(item))
    .catch(() =>
      res.status(404).json({ message: "Not Found!", type: "ERROR" })
    );
}

export default isAuth(handler);

