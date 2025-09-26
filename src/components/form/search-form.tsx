import * as React from "react"
import { cn } from "@/lib/utils"
import { formStore } from "@/store"
import { useTranslation } from 'react-i18next'
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { PopoverContent, Popover, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface Props {
  setFormId: React.Dispatch<React.SetStateAction<any>>;
}

const SearchForm: React.FC<Props> = ({ setFormId }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { formList } = formStore()
  
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
            ? formList.find((form: any) => form.id === value)?.name
            : t('formManagement.selectFormName')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t('formManagement.searchFormName')} />
          <CommandList>
            <CommandEmpty>{t('formManagement.noFormFound')}</CommandEmpty>
            <CommandGroup>
              {formList && formList.map((form: any) => (
                <CommandItem
                  key={form.name}
                  value={form.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setFormId(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === form.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {form.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchForm