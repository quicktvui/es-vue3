export function tryConvertNumber(raw: string): string | number {
  const n = parseFloat(raw);
  return isNaN(n) ? raw : n;
}

export function camelize(str: string): string {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

export function isLength(val: string) {
  return /^(\d+(\.\d+)?)(px|em|rem|%)?$/.test(val);
}

export function isBorderStyle(val: string) {
  return [
    "none",
    "solid",
    "dashed",
    "dotted",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
  ].includes(val);
}

export function splitLayers(input: string): string[] {
  const layers: string[] = [];
  let current = "";
  let depth = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    }

    if (char === "," && depth === 0) {
      layers.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    layers.push(current.trim());
  }

  return layers;
}
