import Item from "models/Item";
import { isAuth, hasFullAccess } from "middlewares/authorization";
import dbConnect from "lib/dbConnect";

const handler = async (req, res) => {
  await dbConnect();

  const {
    query: { itemId },
    body,
    method,
  } = req;
  const canInteract = hasFullAccess(req.rawHeaders);

  if (canInteract && method === "PUT") {
    const item = new Item({ _id: itemId, ...body });
    return Item.findByIdAndUpdate(itemId, item)
      .then((updated) => res.status(201).json({ _id: updated._id }))
      .catch(() => res.status(400).json({ message: "Bad Request!", type: "ERROR" }));
  }

  return res.status(403).json({ message: "Forbidden!", type: "ERROR" });
};

export default isAuth(handler);
