import {FrogSchema} from "../../../../isomophic-src/isomorphic"

export const FROG_MAP: Record<string, string | null> = FrogSchema.options.reduce((acc, frog) => {
  const val = frog.value;
  if (!val) {
    acc[val] = val;
  } else {
    // This is hacky :)
    acc[val] = `/${val}.png`;
  }
  return acc;
}, {} as Record<string, string | null>);

export const FROGS = Object.values(FROG_MAP);