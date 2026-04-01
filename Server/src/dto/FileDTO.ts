export class FileDTO {
  public id: string | null;
  public base64: string;
  public filename: string;
  public encoding: string;
  public mimeType: string;
  constructor(
    id: string | null,
    base64: string,
    filename: string,
    encoding: string,
    mimeType: string
  ) {
    this.id = id;
    this.base64 = base64;
    this.filename = filename;
    this.encoding = encoding;
    this.mimeType = mimeType;
  }

  public static fromJSON = (json: any): FileDTO[] => {
    return (json as Array<any>).map((file) => {
      return new FileDTO(
        file.hasOwnProperty("id") ? file.id : null,
        file.base64,
        file.metadata.filename,
        file.metadata.encoding,
        file.metadata.mimeType
      );
    });
  };

  public getMetaData = (): Object => {
    return {
      filename: this.filename,
      encoding: this.encoding,
      mimeType: this.mimeType,
    };
  };
}
