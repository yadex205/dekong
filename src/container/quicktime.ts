import { BinaryReader } from "../binary-reader";

interface QuickTimeContainerMetadata {
  fileTypeCompatibility: {
    majorBrand: string;
    minorVersion: number;
    compatibleBrands: string[];
  },
  movieData: {
    startPosition: number;
    endPosition: number;
  }
}

class QuickTimeFileParser {
  private _file: Blob;
  private _metadata: Partial<QuickTimeContainerMetadata> = {};

  public static parse = async (file: Blob) => {
    const parser = new QuickTimeFileParser(file);
    await parser.parse();
    return parser.metadata;
  }

  public get metadata() {
    return this._metadata;
  }

  private constructor(file: Blob) {
    this._file = file;
  }

  public parse = async () => {
    for await (const atom of this.scanAtoms(0, this._file.size)) {
      if (atom.type === "ftyp") {
        this.parseFileTypeCompatibilityAtom(await atom.readBodyChunk());
      } else if (atom.type === "mdat") {
        this.parseMovieDataAtom(atom.bodyStartPosition, atom.bodyEndPosition);
      } else if (atom.type === "moov") {
      } else if (atom.type === "wide") {
      }
    }
  }

  private parseFileTypeCompatibilityAtom = (atomBody: BinaryReader) => {
    const majorBrand = atomBody.readString(4);
    const minorVersion = atomBody.readUInt32();
    const compatibleBrands: string[] = [];
    while (!atomBody.isEnd) {
      compatibleBrands.push(atomBody.readString(4));
    }
    this._metadata.fileTypeCompatibility = { majorBrand, minorVersion, compatibleBrands }
  }

  private parseMovieDataAtom = (atomBodyStartPosition: number, atomBodyEndPosition: number) => {
    const startPosition = atomBodyStartPosition;
    const endPosition = atomBodyEndPosition;
    this._metadata.movieData = { startPosition, endPosition };
  }

  private async * scanAtoms(startPosition: number, endPosition: number) {
    let position = startPosition;

    while (position < endPosition) {
      const header = new BinaryReader(await this.readChunk(position, Math.min(position + 16, this._file.size)));
      const shortSize = header.readUInt32();
      const type = header.readString(4);
      const extendedSize = shortSize === 0 ? header.readUInt64() : 0;

      const size = shortSize > 0 ? shortSize : extendedSize;
      const bodyStartPosition = shortSize > 0 ? position + 8 : position + 16;
      const bodyEndPosition = position + size;
      const readBodyChunk = async () => new BinaryReader(await this.readChunk(bodyStartPosition, bodyEndPosition));

      yield { type, size, bodyStartPosition, bodyEndPosition, readBodyChunk };

      position += size;
    }
  }

  private readChunk = async (start: number, end: number) => {
    return await this._file.slice(start, end).arrayBuffer();
  }
}

export class QuickTimeContainer {
  private _file: Blob;
  private _metadata: Partial<QuickTimeContainerMetadata> = {};

  private constructor(file: Blob) {
    this._file = file;
  }

  public parse = async () => {
    this._metadata = await QuickTimeFileParser.parse(this._file);
  }
}
