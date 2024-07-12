export class BinaryReader {
  private _buffer: ArrayBuffer;
  private _dataView: DataView;
  private _isLittleEndian: boolean;
  private _position = 0;

  public constructor(buffer: ArrayBuffer, isLittleEndian = true) {
    this._buffer = buffer;
    this._dataView = new DataView(buffer);
    this._isLittleEndian = isLittleEndian;
  }

  public get size() {
    return this._buffer.byteLength;
  }

  public seek = (position: number) => {
    this._position = position;
  }

  public readUInt8 = () => {
    const value = this._dataView.getUint8(this._position);
    this._position += 1;

    return value;
  }

  public readUInt16 = () => {
    const value = this._dataView.getUint16(this._position, this._isLittleEndian);
    this._position += 2;

    return value;
  }

  public readUInt32 = () => {
    const value = this._dataView.getUint32(this._position, this._isLittleEndian);
    this._position += 4;

    return value;
  }

  public readUInt64 = () => {
    const value = Number(this._dataView.getBigUint64(this._position, this._isLittleEndian));
    this._position += 8;

    return value;
  }

  public readInt8 = () => {
    const value = this._dataView.getInt8(this._position);
    this._position += 1;

    return value;
  }

  public readInt16 = () => {
    const value = this._dataView.getInt16(this._position);
    this._position += 2;

    return value;
  }

  public readUFix16 = () => {
    const integerValue = this._dataView.getUint8(this._position);
    const fractionalValue = this._dataView.getUint8(this._position + 1);
    const value = integerValue + fractionalValue / 2 ** 8;
    this._position += 2;

    return value;
  }

  public readUFix32 = () => {
    const integerValue = this._dataView.getUint16(this._position, this._isLittleEndian);
    const fractionalValue = this._dataView.getUint16(this._position + 2, this._isLittleEndian);
    const value = integerValue + fractionalValue / 2 ** 16;
    this._position += 4;

    return value;
  }

  public readString = (length: number, encoding = "utf-8") => {
    const decoder = new TextDecoder(encoding);
    const value = decoder.decode(new Uint8Array(this._buffer, this._position, length))
    this._position += length;

    return value;
  }

  public readPascalString = (encoding = "utf-8") => {
    const length = this._dataView.getUint8(this._position);
    const decoder = new TextDecoder(encoding);
    const value = decoder.decode(new Uint8Array(this._buffer, this._position + 1, length))
    this._position += (1 + length);

    return value;
  }
}
