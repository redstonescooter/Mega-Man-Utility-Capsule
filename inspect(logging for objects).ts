import util from "util";
const inspect = (obj: any) => {
  return util.inspect(obj, { depth: null, colors: true });
};
