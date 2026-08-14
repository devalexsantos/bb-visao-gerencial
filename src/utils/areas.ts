export interface AreaOption {
  value: string
  label: string
}

export function areaDeUor(nomeUor: string | null | undefined): string {
  return (nomeUor ?? "").split("/")[0].trim().toUpperCase()
}

export function derivarAreas(
  itens: { nome_uor?: string | null }[],
): AreaOption[] {
  const unicas = new Set<string>()

  for (const item of itens) {
    const area = areaDeUor(item.nome_uor)
    if (area) unicas.add(area)
  }

  return Array.from(unicas)
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((area) => ({ value: area, label: area }))
}
