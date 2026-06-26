import { useQuery } from "@tanstack/react-query"
import { portalApi } from "../services/portalApi"

export const useAnsPorArea = (area: string | null) =>
  useQuery({
    queryKey: ["ans_area", area],
    queryFn: () => portalApi.ansPorArea(area as string),
    enabled: !!area,
  })

export const useRacsDoAns = (ansSysId: string | null) =>
  useQuery({
    queryKey: ["ans_racs", ansSysId],
    queryFn: () => portalApi.racsDoAns(ansSysId as string),
    enabled: !!ansSysId,
  })

export const useRcosDoRac = (racSysId: string | null) =>
  useQuery({
    queryKey: ["rac_rcos", racSysId],
    queryFn: () => portalApi.rcosDoRac(racSysId as string),
    enabled: !!racSysId,
  })

export const useHistoricoDoRco = (rcoId: string | null, meses = 6) =>
  useQuery({
    queryKey: ["rco_historico", rcoId, meses],
    queryFn: () => portalApi.historicoDoRco(rcoId as string, meses),
    enabled: !!rcoId,
  })
