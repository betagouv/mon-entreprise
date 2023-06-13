export type XXL = { xxl: true }
export type XL = { xl: true }
export type LG = { lg: true }
export type MD = { md: true }
export type SM = { sm: true }
export type XS = { xs: true }
export type XXS = { xxs: true }

export type KeysOfUnion<T> = T extends T ? keyof T : never
