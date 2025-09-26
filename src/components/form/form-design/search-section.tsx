import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface SearchSectionProps {
  options: { title: string; value: string }[];
  onSelect: (value: string) => void;
  value: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({ options, onSelect, value }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  // Create a safe version of the value for data-value attribute
  const getSafeValue = (value: string) => {
    return (value || '')
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-') // Replace special characters with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single hyphen
      .trim();                    // Trim whitespace
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border-[0.4px] border-gray-200 focus:border-darkBlue outline-none w-full text-[13.5px] p-4 rounded flex justify-between"
        >
          <p>
            {value ? options.find((option) => option.value === value)?.title : t('questionDesign.selectSection')}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 justify-end" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={t('questionDesign.searchSection')}
            onValueChange={setInputValue}
          />
          <CommandList>
            {options.length === 0 && <CommandItem>{t('questionDesign.noSectionFound')}</CommandItem>}
            {options
              .filter((option) =>
                option?.title?.toLowerCase().includes(inputValue?.toLowerCase() || '')
              )
              .map((option) => (
                <CommandItem
                  key={option.value}
                  value={getSafeValue(option.value)} // Use the safe value here
                  onSelect={() => {
                    onSelect(option.value);
                    setOpen(false);
                  }}
                >
                  {option.title}
                  {value === option.value && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchSection;