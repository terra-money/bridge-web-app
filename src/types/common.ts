export type NominalType<T extends string> = { __type: T }

declare global {
  interface Window {
    xfi: any
  }
}
