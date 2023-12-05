export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;


export type DiscriminatedOmit<T, K extends keyof T> = T extends any ? Omit<T, K> : never
