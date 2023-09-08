import { jwtverify } from "jwt-next-auth";
import isEmpty from 'lodash/isEmpty';

export const atob = (base64) =>  Buffer.from(base64, 'base64').toString('binary');

export const auth = async (req, res, next) => {
  let authorizationHeader = req.headers.get("Authorization");
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized token" });
    return next();
  }
};

export const isAuth = (handler) => {
  return async (req, res) =>  {
    const token = req.headers.authorization?.split(" ")[1];
    if (!isEmpty(token)) {
      const verify = await jwtverify(token).then((res) => res.token);
      if (!isEmpty(verify) && token === verify) {
        return handler(req, res);
      }
      return res
        .status(403)
        .send({ message: "You cannot perform this action!", type: "ERROR"  });
    }
    return res
      .status(403)
      .send({ message: "You cannot perform this action!", type: "ERROR"  });
  };
};

export const hasFullAccess = (headers) => {
  if (headers) {
    const token = headers.find((x) => x.startsWith('Bearer')).split(" ")[1];
    const jwtRole = token.split('.')[1];
    const decodedJwtJsonData = atob(jwtRole);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);

    return decodedJwtData.isAdmin;
  }
};


