// O ServiceNow nem sempre devolve listas como array — alguns campos vêm como string
// separada por vírgula (ex.: `indicadores`) e outros podem vir nulos. Este helper
// normaliza qualquer um desses formatos para um array de strings limpo, evitando
// crashes do tipo `x.map is not a function`.
export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  }
  return []
}
