import logoFooter from "../assets/logo.png"

export function Footer() {
  return (
    <footer className="bg-brand-bg-blue text-white mt-auto py-12 pb-6">
      <div className="max-w-7xl mx-auto px-5">
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-300 flex gap-2 items-center justify-center">
            Ditec/GEINT - Equipe de Gestao de Disponibilidade.
            <img src={logoFooter} alt="Banco do Brasil" className="h-6 brightness-0 invert" />
            Uso exclusivo de colaboradores do Grupo BB. Informacoes #internas
          </p>
        </div>
      </div>
    </footer>
  )
}
