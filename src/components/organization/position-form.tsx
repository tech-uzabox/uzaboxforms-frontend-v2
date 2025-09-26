import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { CommandList } from "cmdk";
import { useGetAllUsers } from "@/hooks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { PositionFormProps } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";

export default function PositionForm({
  initialData,
  onSubmit,
  onCancel,
}: PositionFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData);
  const [open, setOpen] = useState(false);

  const { data: usersData, isLoading, isError } = useGetAllUsers();
  const users: any[] = Array.isArray(usersData) ? usersData : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const selectedUser = users.find((user) => user.id === formData.userId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="userId">{t("organization.user")}</Label>
        <Popover modal={true} open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={isLoading || isError}
            >
              {isLoading
                ? t("organization.loadingUsers")
                : isError
                ? t("organization.failedToLoadUsers")
                : selectedUser
                ? `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})`
                : t("organization.selectUser")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder={t("organization.searchUserByNameOrEmail")}
                aria-describedby="user-search-description"
              />
              <CommandEmpty>{t("organization.noUserFound")}</CommandEmpty>
              <CommandList className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <CommandGroup>
                    <CommandItem disabled>
                      {t("organization.loadingUsers")}
                    </CommandItem>
                  </CommandGroup>
                ) : usersData.length > 0 ? (
                  <CommandGroup>
                    {users.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={`${user.firstName} ${user.lastName} ${user.email}`}
                        onSelect={() => {
                          setFormData((prev) => ({ ...prev, userId: user.id }));
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.userId === user.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {user.firstName} {user.lastName} ({user.email})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandGroup>
                    <CommandItem disabled>
                      {t("organization.noUsersAvailable")}
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <p
          id="user-search-description"
          className="text-xs text-muted-foreground"
        >
          {t("organization.searchByFirstNameLastNameOrEmail")}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">{t("organization.title")}</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder={t("organization.chiefExecutiveOfficer")}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button className="main-dark-button" type="submit">
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
}
