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
import { useState, useMemo, useCallback } from "react";
import { Check, ChevronsUpDown, Database } from "lucide-react";

export interface FormData {
  id: string;
  title: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FormAutocompleteProps {
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
  forms: FormData[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function FormAutocomplete({
  value,
  onValueChange,
  forms,
  placeholder = "Select form...",
  disabled = false,
  className,
}: FormAutocompleteProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedForm = useMemo(() => {
    return forms.find((form) => form.id === value);
  }, [forms, value]);

  const filteredForms = useMemo(() => {
    if (!searchQuery.trim()) {
      return forms;
    }

    const query = searchQuery.toLowerCase().trim();
    return forms.filter((form) =>
      form.name.toLowerCase().includes(query) ||
      form.title?.toLowerCase().includes(query) ||
      form.description?.toLowerCase().includes(query)
    );
  }, [forms, searchQuery]);

  const handleSelect = useCallback((currentValue: string) => {
    // The currentValue is the form ID that was selected
    onValueChange(currentValue);
    setOpen(false);
    setSearchQuery("");
  }, [onValueChange]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
    }
  }, []);

  if (forms.length === 0) {
    return (
      <div className={cn("flex items-center justify-center h-10 px-3 py-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-500", className)}>
        <Database className="w-4 h-4 mr-2" />
        {t('processManagement.noFormsAvailable')}
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedForm ? (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Database className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{selectedForm.name}</div>
                {selectedForm.description && (
                  <div className="text-xs text-gray-500 truncate">
                    {selectedForm.description}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Database className="w-4 h-4" />
              <span>{placeholder}</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t('processManagement.searchForms')}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-10"
          />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              <Database className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              {t('processManagement.noFormsFound')}
              {searchQuery && (
                <div className="text-xs mt-1">
                  {t('processManagement.tryAdjustingYourSearchTerms')}
                </div>
              )}
            </CommandEmpty>
            
            <CommandGroup>
              {filteredForms.map((form) => {
                const isSelected = value === form.id;
                return (
                  <CommandItem
                    key={form.id}
                    value={form.id}
                    onSelect={() => handleSelect(form.id)}
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer"
                  >
                  <Database className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm">
                      {form.name}
                    </div>
                    {form.description && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {form.description}
                      </div>
                    )}
                  </div>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4 flex-shrink-0",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
