import { useQuery } from "@tanstack/react-query"
import { portalApi } from "../services/portalApi"

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
