import {HatSchema} from "../../../../isomophic-src/isomorphic"

export const HAT_MAP: Record<string, string | null> = HatSchema.options.reduce((acc, hat) => {
  const val = hat.value;
  if (!val) {
    acc[val] = val;
  } else {
    // This is hacky :)
    acc[val] = `/${val}.png`;
  }
  return acc;
}, {} as Record<string, string | null>);

export const HATS = Object.values(HAT_MAP);