import { Request, Response, NextFunction } from "express";
// import { Error_message_Interface } from "../src/Interface/Error_message_Interface.js";
import { ForbiddenAccessException } from "../error/ForbiddenAccessException";
import { InvalidTokenException } from "../error/InvalidTokenException";
import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
export class JWT {
  public static createAccessToken(credential: string | Object) {
    let accessToken = jwt.sign(
      credential,
      String(process.env.ACCESS_TOKEN_SECRET),
      { expiresIn: "10m" }
    );
    return accessToken;
  }
  public static createRefreshToken(credentials: string | Object) {
    let refreshToken = jwt.sign(
      credentials,
      String(process.env.REFRESH_TOKEN_SECRET),
      { expiresIn: "10m" }
    );
    return refreshToken;
  }

  public static verifyAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authHeader: string | undefined = req.headers["authorization"];
    if (!authHeader) {
      throw ForbiddenAccessException;
    }

    const token = authHeader?.split(" ")[1];
    jwt.verify(
      token,
      String(process.env.ACCESS_TOKEN_SECRET),
      (err, decoded) => {
        if (err) {
          console.log(err);
          throw InvalidTokenException;
        } else {
          console.log("8888888888888888");
          console.log(Object(decoded).id);
          console.log("8888888888888888");

          // Object(req).user_id = decoded?.indexOf;
          Object(req).user_id = Object(decoded).id;
          next();
        }
      }
    );
  }

  //   public static cookieParser(token: any) {

  //     const accessToken = cookies.accessCookie;
  //     console.log(cookies.accessCookie);
  //   }

  public static verifyRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const cookies = req.cookies;
    if (!cookies?.refreshCookie) res.statusCode = 401;
    const refreshToken = cookies.refreshCookie;
    console.log(cookies.refreshCookie);

    //search for client/seller in refreshCookie table

    //_________

    let foundClient = {
      name: "client-1",
      id: 1,
    };

    if (!foundClient) res.statusCode = 403;

    jwt.verify(
      refreshToken,
      String(process.env.REFRESH_TOKEN_SECRET),
      (err: any, decoded: any) => {
        if (err || foundClient.id != decoded.id) {
          res.statusCode = 403;
        }

        const accessToken = this.createAccessToken(String(foundClient.id));
        res.json({ accessToken });
      }
    );
  }
}
