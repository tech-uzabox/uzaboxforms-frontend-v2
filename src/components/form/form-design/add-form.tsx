import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Icon } from "@iconify/react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ComboBoxProps {
  name?: string;
  options: { title: string; value: string; icon: string }[];
  onSelect: (value: string) => void;
}

const AddForm: React.FC<ComboBoxProps> = ({ options, onSelect, name }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between border-none hover:bg-inherit text-darkBlue items-center space-x-1 p-0"
        >
          <Icon icon={"gg:add"} fontSize={21} />
          <div>
            {value ? options.find((option) => option.value === value)?.title : name ? name : t('questionDesign.addItem')}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-[280px] w-full p-0">
        <Command>
          <CommandInput placeholder={t('questionDesign.searchForm')} />
          <CommandList>
            <CommandEmpty>{t('questionDesign.notFormFound')}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.title}
                  onSelect={() => {
                    setValue(option.value === value ? "" : option.title);
                    onSelect(option.value === value ? "" : option.value);
                    setValue("");
                    setOpen(false);
                  }}
                  className="space-x-3"
                >
                  {option.icon && (
                    <div className="p-2 rounded bg-subprimary text-[#494C52]">
                      <Icon icon={option.icon} fontSize={18} />
                    </div>
                  )}
                  <p>{option.title}</p>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AddForm;