type FormDataValue = string | Uint8Array;

interface FormDataEntry {
  name: string;
  value: FormDataValue;
  filename?: string;
}

export class UniversalFormData {
  private entriesList: FormDataEntry[] = [];
  private boundary: string;

  constructor() {
    this.boundary = "----FormDataBoundary" + Math.random().toString(36).substr(2, 12);
  }

  append(name: string, value: FormDataValue, filename?: string) {
    this.entriesList.push({ name, value, filename });
  }

  delete(name: string) {
    this.entriesList = this.entriesList.filter((entry) => entry.name !== name);
  }

  get(name: string): FormDataValue | null {
    const entry = this.entriesList.find((e) => e.name === name);
    return entry ? entry.value : null;
  }

  getAll(name: string): FormDataValue[] {
    return this.entriesList.filter((e) => e.name === name).map((e) => e.value);
  }

  has(name: string): boolean {
    return this.entriesList.some((e) => e.name === name);
  }

  *entries(): IterableIterator<[string, FormDataValue]> {
    for (const entry of this.entriesList) {
      yield [entry.name, entry.value];
    }
  }

  *keys(): IterableIterator<string> {
    for (const entry of this.entriesList) {
      yield entry.name;
    }
  }

  *values(): IterableIterator<FormDataValue> {
    for (const entry of this.entriesList) {
      yield entry.value;
    }
  }

  getContentType(): string {
    return `multipart/form-data; boundary=${this.boundary}`;
  }

  getBody(): Uint8Array {
    const encoder = new TextEncoder();
    const chunks: Uint8Array[] = [];

    for (const entry of this.entriesList) {
      chunks.push(encoder.encode(`--${this.boundary}\r\n`));
      if (entry.filename) {
        chunks.push(
          encoder.encode(
            `Content-Disposition: form-data; name="${entry.name}"; filename="${entry.filename}"\r\n\r\n`,
          ),
        );
      } else {
        chunks.push(encoder.encode(`Content-Disposition: form-data; name="${entry.name}"\r\n\r\n`));
      }

      if (typeof entry.value === "string") {
        chunks.push(encoder.encode(entry.value));
      } else {
        chunks.push(entry.value);
      }

      chunks.push(encoder.encode("\r\n"));
    }

    chunks.push(encoder.encode(`--${this.boundary}--\r\n`));

    // 合并所有 Uint8Array
    let length = 0;
    for (const chunk of chunks) length += chunk.length;

    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }

    return body;
  }
}
