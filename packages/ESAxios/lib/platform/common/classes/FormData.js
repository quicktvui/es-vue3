/**
 *
 */
function generateBoundary() {
  return "----FormDataBoundary" + Math.random().toString(36).substr(2, 12);
}

export default class FormData {
  constructor() {
    this.entriesList = [];
    this.boundary = generateBoundary();
  }

  append(name, value, filename) {
    this.entriesList.push({ name, value, filename });
  }

  delete(name) {
    this.entriesList = this.entriesList.filter((entry) => entry.name !== name);
  }

  get(name) {
    const entry = this.entriesList.find((e) => e.name === name);
    return entry ? entry.value : null;
  }

  getAll(name) {
    return this.entriesList.filter((e) => e.name === name).map((e) => e.value);
  }

  has(name) {
    return this.entriesList.some((e) => e.name === name);
  }

  *entries() {
    for (const entry of this.entriesList) {
      yield [entry.name, entry.value];
    }
  }

  *keys() {
    for (const entry of this.entriesList) {
      yield entry.name;
    }
  }

  *values() {
    for (const entry of this.entriesList) {
      yield entry.value;
    }
  }

  getContentType() {
    return "multipart/form-data; boundary=" + this.boundary;
  }

  getBody() {
    var encoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
    var chunks = [];

    this.entriesList.forEach(function (entry) {
      chunks.push(
        encoder ? encoder.encode("--" + this.boundary + "\r\n") : "--" + this.boundary + "\r\n",
      );

      if (entry.filename) {
        chunks.push(
          encoder
            ? encoder.encode(
                'Content-Disposition: form-data; name="' +
                  entry.name +
                  '"; filename="' +
                  entry.filename +
                  '"\r\n\r\n',
              )
            : 'Content-Disposition: form-data; name="' +
                entry.name +
                '"; filename="' +
                entry.filename +
                '"\r\n\r\n',
        );
      } else {
        chunks.push(
          encoder
            ? encoder.encode('Content-Disposition: form-data; name="' + entry.name + '"\r\n\r\n')
            : 'Content-Disposition: form-data; name="' + entry.name + '"\r\n\r\n',
        );
      }

      if (typeof entry.value === "string") {
        chunks.push(encoder ? encoder.encode(entry.value) : entry.value);
      } else {
        chunks.push(entry.value);
      }

      chunks.push(encoder ? encoder.encode("\r\n") : "\r\n");
    }, this);

    chunks.push(
      encoder ? encoder.encode("--" + this.boundary + "--\r\n") : "--" + this.boundary + "--\r\n",
    );

    if (!encoder) {
      // 纯字符串模式，直接拼接
      return chunks.join("");
    }

    // 合并 Uint8Array
    var totalLength = chunks.reduce(function (acc, val) {
      return acc + val.length;
    }, 0);

    var body = new Uint8Array(totalLength);
    var offset = 0;
    chunks.forEach(function (chunk) {
      body.set(chunk, offset);
      offset += chunk.length;
    });

    return body;
  }
}

// 使用示例
/*
var fd = new FormData();
fd.append('field1', 'hello');
fd.append('file1', new Uint8Array([1,2,3]), 'test.bin');

console.log(fd.getContentType());
console.log(fd.getBody());
*/
