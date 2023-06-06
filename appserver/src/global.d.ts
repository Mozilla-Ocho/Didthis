
type JSONABLE =
  | undefined
  | boolean
  | string
  | number
  | { [key: string]: JSONABLE }
  | Array<JSONABLE>;

type POJO = { [key: string]: JSONABLE };


