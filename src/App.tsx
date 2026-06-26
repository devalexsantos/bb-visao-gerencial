import { AlertTriangle } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Layout } from "./components/Layout"
import { useAnsPorArea } from "./hooks/usePortal"
import { AnsKpiCards } from "./sections/AnsKpiCards"
import { AnsRacs } from "./sections/AnsRacs"
import { AreaFilter } from "./sections/AreaFilter"
import { IndicatorHistory } from "./sections/IndicatorHistory"
import { RacRcos } from "./sections/RacRcos"

export function App() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)
  const [selectedAnsSysId, setSelectedAnsSysId] = useState<string | null>(null)
  const [selectedRacSysId, setSelectedRacSysId] = useState<string | null>(null)
  const [selectedRcoSysId, setSelectedRcoSysId] = useState<string | null>(null)

  const racsRef = useRef<HTMLDivElement>(null)
  const rcosRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const scrollTo = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }, [])

  const handleAreaChange = useCallback((area: string) => {
    setSelectedArea(area)
    setSelectedAnsSysId(null)
    setSelectedRacSysId(null)
    setSelectedRcoSysId(null)
  }, [])

  const handleAnsSelect = useCallback((sysId: string) => {
    setSelectedAnsSysId(sysId)
    setSelectedRacSysId(null)
    setSelectedRcoSysId(null)
  }, [])

  const handleRacSelect = useCallback((sysId: string) => {
    setSelectedRacSysId(sysId)
    setSelectedRcoSysId(null)
  }, [])

  const handleRcoSelect = useCallback((sysId: string) => {
    setSelectedRcoSysId(sysId)
  }, [])

  // Scroll effects
  useEffect(() => {
    if (selectedAnsSysId) scrollTo(racsRef)
  }, [selectedAnsSysId, scrollTo])

  useEffect(() => {
    if (selectedRacSysId) scrollTo(rcosRef)
  }, [selectedRacSysId, scrollTo])

  useEffect(() => {
    if (selectedRcoSysId) scrollTo(historyRef)
  }, [selectedRcoSysId, scrollTo])

  // Dados da API
  const ansQuery = useAnsPorArea(selectedArea)
  const ansList = Array.isArray(ansQuery.data?.result)
    ? ansQuery.data.result
    : []
  const selectedAns = ansList.find((a) => a.sys_id === selectedAnsSysId)
  const ansNome = selectedAns
    ? selectedAns.apelido?.trim() || selectedAns.servico
    : ""

  return (
    <Layout>
      <div className="space-y-4">
        <AreaFilter
          selectedArea={selectedArea}
          onAreaChange={handleAreaChange}
        />

        {selectedArea && (
          <div>
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

            {!ansQuery.isLoading &&
              !ansQuery.isError &&
              ansList.length === 0 && (
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
          <div ref={racsRef}>
            <AnsRacs
              ans={selectedAns}
              selectedRacSysId={selectedRacSysId}
              onSelectRac={handleRacSelect}
            />
          </div>
        )}

        {selectedRacSysId && (
          <div ref={rcosRef}>
            <RacRcos
              racSysId={selectedRacSysId}
              ansNome={ansNome}
              selectedRcoSysId={selectedRcoSysId}
              onSelectRco={handleRcoSelect}
            />
          </div>
        )}

        {selectedRcoSysId && (
          <div ref={historyRef}>
            <IndicatorHistory rcoSysId={selectedRcoSysId} />
          </div>
        )}
      </div>
    </Layout>
  )
}
