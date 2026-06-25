import { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Layout } from "./components/Layout"
import { useAnsPorArea, useIndicadoresDoAns } from "./hooks/usePortal"
import { AnsKpiCards } from "./sections/AnsKpiCards"
import { AreaFilter } from "./sections/AreaFilter"
import { IndicadoresList } from "./sections/IndicadoresList"
import { IndicatorHistory } from "./sections/IndicatorHistory"

export function App() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [selectedAnsSysId, setSelectedAnsSysId] = useState<string | null>(null)
  const [selectedIndicadorSysId, setSelectedIndicadorSysId] = useState<
    string | null
  >(null)

  const ansRef = useRef<HTMLDivElement>(null)
  const indicadoresRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const scrollTo = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [])

  const handleAreaChange = useCallback((area: string) => {
    setSelectedArea(area)
    setSelectedAnsSysId(null)
    setSelectedIndicadorSysId(null)
  }, [])

  const handleAnsSelect = useCallback((sysId: string) => {
    setSelectedAnsSysId(sysId)
    setSelectedIndicadorSysId(null)
  }, [])

  const handleIndicadorSelect = useCallback((sysId: string) => {
    setSelectedIndicadorSysId(sysId)
  }, [])

  // Scroll effects
  useEffect(() => {
    if (selectedAnsSysId) scrollTo(indicadoresRef)
  }, [selectedAnsSysId, scrollTo])

  useEffect(() => {
    if (selectedIndicadorSysId) scrollTo(historyRef)
  }, [selectedIndicadorSysId, scrollTo])

  // Dados da API
  const ansQuery = useAnsPorArea(selectedArea)
  const ansList = ansQuery.data?.result ?? []
  const selectedAns = ansList.find((a) => a.sys_id === selectedAnsSysId)

  const indicadoresQuery = useIndicadoresDoAns(selectedAnsSysId)

  return (
    <Layout>
      <div className="space-y-4">
        <AreaFilter
          selectedArea={selectedArea}
          onAreaChange={handleAreaChange}
        />

        {selectedArea && (
          <div ref={ansRef}>
            {ansQuery.isLoading && (
              <section className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-soft py-6 text-center">
                  Carregando ANS da area…
                </p>
              </section>
            )}

            {ansQuery.isError && (
              <section className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle
                    size={16}
                    className="text-danger mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-red-800">
                    {ansQuery.error?.message ?? "Erro ao carregar os ANS."}
                  </p>
                </div>
              </section>
            )}

            {!ansQuery.isLoading && !ansQuery.isError && ansList.length === 0 && (
              <section className="bg-white rounded-lg shadow-sm p-4">
                <p className="text-sm text-soft py-6 text-center">
                  Nenhum ANS encontrado para esta area.
                </p>
              </section>
            )}

            {ansList.length > 0 && (
              <AnsKpiCards
                ansList={ansList}
                selectedAnsSysId={selectedAnsSysId}
                onSelectAns={handleAnsSelect}
              />
            )}
          </div>
        )}

        {selectedAns && (
          <div ref={indicadoresRef}>
            <IndicadoresList
              ans={selectedAns}
              indicadores={indicadoresQuery.data?.result ?? []}
              aviso={indicadoresQuery.data?.aviso}
              isLoading={indicadoresQuery.isLoading}
              isError={indicadoresQuery.isError}
              errorMessage={indicadoresQuery.error?.message}
              selectedIndicadorSysId={selectedIndicadorSysId}
              onSelectIndicador={handleIndicadorSelect}
            />
          </div>
        )}

        {selectedIndicadorSysId && (
          <div ref={historyRef}>
            <IndicatorHistory indicadorSysId={selectedIndicadorSysId} />
          </div>
        )}
      </div>
    </Layout>
  )
}
