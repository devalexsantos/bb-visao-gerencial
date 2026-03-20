import { useState, useEffect } from "react"
import type React from "react"
import * as RadixSelect from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"

export type SelectOption = {
  value: string
  label: React.ReactNode
}

export interface SelectProps {
  options: SelectOption[]
  placeholder?: string
  triggerClassName?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function Select({
  options,
  placeholder = "Selecione uma opcao",
  triggerClassName = "w-full outline-none",
  value: controlledValue,
  onValueChange: controlledOnValueChange,
}: SelectProps) {
  const [value, setValue] = useState<string | undefined>(controlledValue)

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  const handleValueChange = (val: string) => {
    if (controlledOnValueChange) controlledOnValueChange(val)
    else setValue(val)
  }

  return (
    <RadixSelect.Root value={value} onValueChange={handleValueChange}>
      <RadixSelect.Trigger
        className={[
          triggerClassName,
          "rounded-t-sm border-b border-b-zinc-300 cursor-pointer bg-white",
          "flex items-center justify-between px-3 py-2 text-text-black",
        ].join(" ")}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className="text-text-zinc">
          <ChevronDown size={16} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Content
        className="bg-default rounded-lg shadow-lg p-2 z-50 w-[var(--radix-select-trigger-width)]"
        position="popper"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <RadixSelect.Viewport className="p-2">
          {options.map(({ value, label }) => (
            <RadixSelect.Item
              key={value}
              value={value}
              className="text-text-zinc hover:bg-brand-blue hover:text-white rounded-lg p-2 cursor-pointer outline-none"
            >
              <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
            </RadixSelect.Item>
          ))}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Root>
  )
}
