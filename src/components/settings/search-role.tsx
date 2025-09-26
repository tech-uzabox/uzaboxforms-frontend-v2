
import * as React from "react"
import { Role } from "@/types"

import { cn } from "@/lib/utils"
import { roleStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface props{
    setRoleId: React.Dispatch<React.SetStateAction<string>>;
}

const SearchRole: React.FC<props> = ({ setRoleId }) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { roles } = roleStore()
  
  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {value
            ? roles?.find((role: Role) => role.id === value)?.name
            : "Select role..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search role..." />
          <CommandList>
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup>
              {roles && roles.map((role: Role) => (
                <CommandItem
                  key={role.name}
                  value={role.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setRoleId(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === role.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {role.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchRole