import { Role } from '@/types';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { roleStore } from '@/store/user';
import { useTranslation } from 'react-i18next';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface RoleSelectorProps {
  selectedRoles: string[];
  onRolesChange: (roles: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  label?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRoles,
  onRolesChange,
  placeholder,
  className,
  disabled = false,
  error,
  required = false,
  label,
}) => {
  const { t } = useTranslation();
  const { roles } = roleStore();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Filter roles based on search
  const filteredRoles = roles ? roles.filter((role: Role) =>
    role?.name?.toLowerCase().includes(searchValue?.toLowerCase() || '')
  ) : [];

  const handleRoleSelect = (roleId: string) => {
    const newRoles = selectedRoles.includes(roleId)
      ? selectedRoles.filter((role) => role !== roleId)
      : [...selectedRoles, roleId];
    onRolesChange(newRoles);
  };

  const handleRoleRemove = (roleId: string) => {
    const newRoles = selectedRoles.filter((role) => role !== roleId);
    onRolesChange(newRoles);
  };

  const getSelectednames = () => {
    return selectedRoles.map(roleId => {
      const role = roles?.find(r => r.id === roleId);
      return role?.name || roleId;
    });
  };


  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="main-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "cursor-pointer w-full min-h-[40px] px-3 py-2 border rounded-md focus:outline-none focus:ring-darkBlue focus:border-darkBlue sm:text-sm flex items-center justify-between",
              error ? "border-red-500" : "border-gray-300",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedRoles.length > 0 ? (
                getSelectednames().map((name, index) => (
                  <span
                    key={selectedRoles[index]}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleRemove(selectedRoles[index]);
                      }}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-500">
                  {placeholder || t('processManagement.selectRoles')}
                </span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 opacity-50 flex-shrink-0" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <Command>
            <CommandInput 
              placeholder={t('processManagement.searchRoles')} 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>{t('processManagement.noRolesFound')}</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-48">
                  {filteredRoles.map((role: Role) => (
                    <CommandItem
                      key={role.id}
                      value={role.id}
                      onSelect={() => handleRoleSelect(role.id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedRoles.includes(role.id) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {role.name}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default RoleSelector;
