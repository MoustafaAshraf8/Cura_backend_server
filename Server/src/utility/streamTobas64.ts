import { GridFSBucketReadStream } from "mongodb";

export const streamToBase64 = (stream: GridFSBucketReadStream) => {
  const concat = require("concat-stream");
  const { Base64Encode } = require("base64-stream");

  return new Promise((resolve, reject) => {
    const base64 = new Base64Encode();

    const cbConcat = (base64: any) => {
      resolve(base64);
    };

    stream
      .pipe(base64)
      .pipe(concat(cbConcat))
      .on("error", (error: any) => {
        reject(error);
      });
  });
};
