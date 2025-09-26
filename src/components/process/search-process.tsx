
import * as React from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from 'react-i18next'
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { ProcessAndRoleStore } from "@/store/process/process-and-role-store"
import { PopoverContent, Popover, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface Props {
  setProcessId: React.Dispatch<React.SetStateAction<any>>;
}

const SearchProcess: React.FC<Props> = ({ setProcessId }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { processAndRoles } = ProcessAndRoleStore()
  
  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full hover:bg-white"
        >
          {value
            ? processAndRoles.find((process: any) => process.id === value)?.processName
            : t('processManagement.selectProcessName')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t('processManagement.searchProcessName')} />
          <CommandList>
            <CommandEmpty>{t('processManagement.noProcessFound')}</CommandEmpty>
            <CommandGroup>
              {processAndRoles && processAndRoles.map((process: any) => (
                <CommandItem
                  key={process.id}
                  value={process.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setProcessId(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === process.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {process.processName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchProcess