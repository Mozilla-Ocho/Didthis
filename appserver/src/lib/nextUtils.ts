import { NextRouter } from "next/router";

const getParamString = (router: NextRouter, param: string): string => {
  let x = router.query[param];
  x = Array.isArray(x) ? x.join(",") : x;
  x = typeof x === "undefined" ? "" : x;
  x = x === null ? "" : x;
  return x + "";
};

export { getParamString };
