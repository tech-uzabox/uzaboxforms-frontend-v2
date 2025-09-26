
import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import type { User } from "@/types"
import { userStore } from "@/store/user"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"

interface Props {
  setUserId: React.Dispatch<React.SetStateAction<any>>;
  selectedUserId?: string;
  onUserSelect?: (user: User) => void;
}

const SearchUser: React.FC<Props> = ({ setUserId, selectedUserId, onUserSelect }) => {
  const { users } = userStore()
  const [open, setOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User>()

  // Optional: pre-select user if selectedUserId is provided
  React.useEffect(() => {
    if (selectedUserId && users) {
      const user = users.find((u) => u.id === selectedUserId)
      if (user) {
        setSelectedUser(user)
      }
    }
  }, [selectedUserId, users])

  const handleSelect = (user: User) => {
    setSelectedUser(user)
    setUserId(user.id)
    if (onUserSelect) onUserSelect(user)
    setOpen(false)
  }

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})`
            : "Select user..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users?.map((user) => (
                <CommandItem
                  key={user.id}
                  value={`${user.firstName} ${user.lastName} ${user.email}`}
                  onSelect={() => handleSelect(user)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.firstName} {user.lastName} ({user.email})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SearchUser