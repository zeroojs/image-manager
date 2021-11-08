declare module ImageGroupModule {
  export interface Group {
    id: number
    name: string
    count?: number
    images?: ImageModule.Image[]
    createAt?: Date
    updateAt?: Date
  }
}