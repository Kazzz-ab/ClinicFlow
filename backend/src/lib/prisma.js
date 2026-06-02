import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

// Recursively adds _id alias to every object that has an id field
// so the frontend (which uses ._id throughout) keeps working unchanged.
export function withId(data) {
  if (Array.isArray(data)) return data.map(withId);
  if (data && typeof data === 'object' && !(data instanceof Date)) {
    const out = {};
    for (const [k, v] of Object.entries(data)) {
      out[k] = withId(v);
    }
    if ('id' in out) out._id = out.id;
    return out;
  }
  return data;
}
