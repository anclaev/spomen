export * from './config'

export type Writeable<T> = { [P in keyof T]: T[P] }
