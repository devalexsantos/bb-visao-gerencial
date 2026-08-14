export function isVigente(status: string | null | undefined): boolean {
  return (
    (status ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim() === "vigente"
  )
}
