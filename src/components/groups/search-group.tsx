
import * as React from "react";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { groupStore } from "@/store/group/group-store";

interface Props {
  setGroupId: (id: string) => void;
  groupId: string;
}

const SearchGroup: React.FC<Props> = ({ setGroupId, groupId }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const { groups } = groupStore();

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {groupId && groups
            ? groups.find((group: any) => group.id === groupId)?.name || t('groupManagement.selectGroup')
            : t('groupManagement.selectGroup')}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t('groupManagement.searchGroup')} />
          <CommandList>
            <CommandEmpty>{t('groupManagement.noGroupFound')}</CommandEmpty>
            <CommandGroup>
              {groups?.map((group: any) => (
                <CommandItem
                  key={group.id}
                  value={group.name}
                  onSelect={() => {
                    setGroupId(group.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      groupId === group.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {group.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchGroup;