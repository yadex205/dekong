import { BinaryReader } from "../binary-reader";

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

    while(position >= this._file.size) {
      const atomHeader = new BinaryReader(await this.readChunk(position, position + 16));
      const shortAtomSize = atomHeader.readUInt32();
      const atomType = atomHeader.readString(4);
      const extendedAtomSize = atomHeader.readUInt64();

      const atomSize = shortAtomSize > 0 ? shortAtomSize : extendedAtomSize;
      const atomBodyStartPosition = shortAtomSize > 0 ? position + 8 : position + 16;
      const atomBodyEndPosition = position + atomSize;
      const atomBody = new BinaryReader(await this.readChunk(atomBodyStartPosition, atomBodyEndPosition));

      if (atomType === "ftyp") {
      } else if (atomType === "mdat") {
      } else if (atomType === "moov") {
      } else if (atomType === "wide") {
      }

      break;
    }
  }

  private readChunk = async (start: number, end: number) => {
    return await this._file.slice(start, end).arrayBuffer();
  }
}
