import Item from "models/Item";
import { isAuth, hasFullAccess } from "middlewares/authorization";
import dbConnect from "lib/dbConnect";

const handler = async (req, res) => {
  await dbConnect();

  const {
    query: { itemId },
    method,
  } = req;
  const canInteract = hasFullAccess(req.rawHeaders);

  if (canInteract && method === "DELETE") {
    return Item.findByIdAndRemove(itemId)
      .then((deleted) => res.status(200).json({ _id: deleted._id }))
      .catch(() =>
        res.status(400).json({ message: "Bad Request!", type: "ERROR" })
      );
  }

  return res.status(403).json({ message: "Forbidden!", type: "ERROR" });
};

export default isAuth(handler);
