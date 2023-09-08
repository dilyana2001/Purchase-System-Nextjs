import isEmpty from "lodash/isEmpty";
import User from "models/User";
import dbConnect from "lib/dbConnect";
import { jwtSign } from "jwt-next-auth";

export default async function handler(req, res) {
  await dbConnect();
  const {
    method,
    body: { username, password },
  } = req;

  if (method !== "POST") return res
    .status(405)
    .json({ message: "Method Not Allowed!", type: "ERROR" });

  const user = await User.findOne({ username, password });

  if (isEmpty(user)) return res
    .status(401)
    .json({ message: "Unauthorized!", type: "ERROR" });

  try {
    const token = await jwtSign({ ...req.body, isAdmin: user?.isAdmin, _id: user._id }, req, res).then((res) => res);
    res.status(200).json({
      token,
      username,
      isAdmin: user?.isAdmin,
      _id: user._id,
    });
  } catch (error) {
    res
      .status(404)
      .json({ message: "No such user or password!", type: "ERROR" });
  }
}
