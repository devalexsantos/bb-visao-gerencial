interface Attributes {
  values: string[]
  name: string
}

interface Token {
  tokenId: string
}

interface DispAcessos {
  rotas: string[]
}

export interface User {
  roles: string[]
  attributes: Attributes[]
  token: Token
  dispAcessos: DispAcessos
}
