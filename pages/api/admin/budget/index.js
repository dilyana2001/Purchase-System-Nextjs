import Budget from "models/Budget";
import { isAuth, hasFullAccess } from "middlewares/authorization";
import dbConnect from "lib/dbConnect";

const customId = process.env.NEXTAUTH_BUDGET;

const handler = async (req, res) => {
  await dbConnect();
  const {
    body,
    method,
  } = req;
  const canInteract = hasFullAccess(req.rawHeaders);

  if (!canInteract) return res.status(403).json({ message: "Forbidden!", type: "ERROR" });

  if (method === "PUT" || method === "POST" || method === "PATCH") {
    const oldBudget = await Budget.findById(customId).exec();

    return Budget.findByIdAndUpdate(customId, { _id: customId, total: Number(body.total) + Number(oldBudget.total) })
      .then((updated) => res.status(201).json({ _id: updated._id }))
      .catch(() => res.status(400).json({ message: "Bad Request!", type: "ERROR" }));
  }

  if (method === "DELETE") {
    return Budget.findByIdAndUpdate(customId, { _id: customId, total: 0 })
      .then((updated) => res.status(201).json({ _id: updated._id }))
      .catch(() => res.status(400).json({ message: "Bad Request!", type: "ERROR" }));
  }

  return Budget.find()
    .sort({ _id: -1 })
    .then((budgets) => res.status(200).json(budgets))
    .catch(() => res.status(404).json({ message: "Not Found!", type: "ERROR" }));
};

export default isAuth(handler);
