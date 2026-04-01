export class test {
  private static fileStoreBucket: String = "FileStore";
  constructor() {}

  public static getFileStoreName(): String {
    return this.fileStoreBucket;
  }
}
