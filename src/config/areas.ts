// A API do ServiceNow não expõe um endpoint para listar áreas — o parâmetro `area`
// é um filtro CONTAINS sobre `nome_uor`. Por isso a lista é configurada aqui.
// `value` é o termo enviado como `area` na chamada `ans_area`.
// Edite à vontade para incluir/remover áreas.

export interface AreaOption {
  value: string
  label: string
}

export const AREAS: AreaOption[] = [
  { value: "Diris", label: "Diris" },
  { value: "Ditec", label: "Ditec" },
  { value: "Diope", label: "Diope" },
]
