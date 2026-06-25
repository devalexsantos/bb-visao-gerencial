import { AlertTriangle } from "lucide-react"
import { Component, type ErrorInfo, type ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Mantém o erro visível no console para diagnóstico.
    console.error("Erro de render capturado pelo ErrorBoundary:", error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (error) {
      return (
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={22} className="text-danger mt-0.5 shrink-0" />
            <div className="space-y-2">
              <h2 className="text-base font-bold text-text-blue">
                Algo quebrou ao renderizar a tela
              </h2>
              <p className="text-sm text-soft">
                Ocorreu um erro inesperado. Detalhe técnico abaixo:
              </p>
              <pre className="text-xs bg-neutral rounded-md p-3 overflow-x-auto text-red-800 whitespace-pre-wrap">
                {error.message}
              </pre>
              <button
                type="button"
                onClick={this.handleReset}
                className="text-sm border border-brand-blue text-brand-blue rounded-md px-3 py-1.5 hover:bg-brand-blue hover:text-white transition-colors cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
