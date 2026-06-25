import { useQueries, useQuery } from "@tanstack/react-query"
import { portalApi } from "../services/portalApi"
import type { ApuracoesResponse } from "../types/portal"

export const useAnsPorArea = (area: string | null) =>
  useQuery({
    queryKey: ["ans_area", area],
    queryFn: () => portalApi.ansPorArea(area as string),
    enabled: !!area,
  })

export const useIndicadoresDoAns = (ansSysId: string | null) =>
  useQuery({
    queryKey: ["indicadores_ans", ansSysId],
    queryFn: () => portalApi.indicadoresDoAns(ansSysId as string),
    enabled: !!ansSysId,
  })

export const useApuracoes = (indicadorSysId: string | null) =>
  useQuery({
    queryKey: ["apuracoes", indicadorSysId],
    queryFn: () => portalApi.apuracoes(indicadorSysId as string),
    enabled: !!indicadorSysId,
  })

export const useHistoricoApuracao = (apuracaoId: string | null, meses = 6) =>
  useQuery({
    queryKey: ["apuracao_historico", apuracaoId, meses],
    queryFn: () => portalApi.historicoApuracao(apuracaoId as string, meses),
    enabled: !!apuracaoId,
  })

/**
 * % de conformidade de um ANS, calculado no cliente (a API não fornece esse número).
 *
 * Estratégia: busca os indicadores do ANS (`indicadores_ans`, cacheada e reusada ao
 * fazer drill-down) e, em paralelo (`useQueries`), as apurações de cada indicador.
 * Para cada indicador considera a ÚLTIMA apuração (`result` já vem cronológico) e
 * calcula a fração com `conforme === true`, ignorando pontos com `conforme === null`.
 */
export function useConformidadeDoAns(ansSysId: string) {
  const indicadoresQuery = useIndicadoresDoAns(ansSysId)
  const indicadorIds =
    indicadoresQuery.data?.result.map((i) => i.sys_id) ?? []

  const apuracoesQueries = useQueries({
    queries: indicadorIds.map((id) => ({
      queryKey: ["apuracoes", id],
      queryFn: () => portalApi.apuracoes(id),
      enabled: !!id,
    })),
  })

  const isLoading =
    indicadoresQuery.isLoading || apuracoesQueries.some((q) => q.isLoading)

  let considerados = 0
  let conformes = 0
  for (const q of apuracoesQueries) {
    const data = q.data as ApuracoesResponse | undefined
    const ultima = data?.result.at(-1)
    if (!ultima || ultima.conforme === null || ultima.conforme === undefined) {
      continue
    }
    considerados += 1
    if (ultima.conforme) conformes += 1
  }

  const pct =
    considerados > 0 ? Math.round((conformes / considerados) * 100) : null

  return { pct, isLoading, temIndicadores: indicadorIds.length > 0 }
}
