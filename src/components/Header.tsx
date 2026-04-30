import brandIcon from "../assets/icons/brand-white-icon.svg"

export function Header() {
  return (
    <header className="w-full flex flex-col">
      <div className="bg-brand-bg-blue px-4 py-2 flex items-center gap-4">
        <img
          src={brandIcon}
          alt="Logo Banco do Brasil"
          className="w-[36px] h-[36px]"
        />
        <h1 className="text-lg text-brand-white font-bold font-bb-titulos">
          Visao Cliente - Acompanhamento de ANS
        </h1>
      </div>
      <div className="w-full h-1 bg-brand-yellow" />
    </header>
  )
}
