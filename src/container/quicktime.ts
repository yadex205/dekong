class QuickTimeContainer {
  private _file: Blob;

  public static parse = async (file: Blob) => {
    const container = new QuickTimeContainer(file);
    await container.parse();

    return container;
  }

  private constructor(file: Blob) {
    this._file = file;
  }

  public parse = async () => {
    let position = 0;
    // const atomHeaderChunk = this.readChunk()
  }

  private readChunk = async (start: number, end: number) => {
    return await this._file.slice(start, end).arrayBuffer();
  }
}
