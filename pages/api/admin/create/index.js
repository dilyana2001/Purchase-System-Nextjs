import Item from "models/Item";
import { isAuth, hasFullAccess } from "middlewares/authorization";
import dbConnect from "lib/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const {
    body,
    method,
  } = req;
  const canInteract = hasFullAccess(req.rawHeaders);

  if (canInteract && method === "POST") {
    const item = new Item(body);
    return item
      .save()
      .then((createdItem) => res.status(201).json({ _id: createdItem._id }))
      .catch(() => res.status(400).json({ message: "Bad Request!!" }));
  }
  
  return res.status(403).json({ message: "Forbidden!", type: "ERROR" });
};

export default isAuth(handler);
