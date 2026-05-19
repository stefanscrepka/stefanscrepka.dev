// Gotcha #5: Server Actions usam FormData mas react-hook-form envia JSON.
// Bridge converte JSON object → FormData no client antes de chamar action.

export function jsonToFormData<T extends Record<string, unknown>>(data: T): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;
    if (value instanceof File || value instanceof Blob) {
      fd.append(key, value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        fd.append(`${key}[]`, String(item));
      }
    } else if (typeof value === 'object') {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}

export function formDataToObject(fd: FormData): Record<string, string | string[]> {
  const obj: Record<string, string | string[]> = {};
  for (const [key, value] of fd.entries()) {
    if (typeof value !== 'string') continue;
    if (key.endsWith('[]')) {
      const k = key.slice(0, -2);
      const existing = obj[k];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        obj[k] = [value];
      }
    } else {
      obj[key] = value;
    }
  }
  return obj;
}
