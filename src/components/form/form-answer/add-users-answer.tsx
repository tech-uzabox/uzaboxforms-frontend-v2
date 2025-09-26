import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { useGetAllUsers } from "@/hooks";
import type { QuestionTypes } from "@/types";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { X, Check, ChevronsUpDown } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { useFormResponseStore } from "@/store/form/use-form-response-store";

interface AddUsersAnswerProps {
  question: QuestionTypes;
  sectionId: string;
  sectionName: string;
  setValidationErrors: (
    sectionId: string,
    questionId: string,
    error: string | null
  ) => void;
}

export const AddUsersAnswer: React.FC<AddUsersAnswerProps> = ({
  question,
  sectionId,
  sectionName,
  setValidationErrors,
}) => {
  const { t } = useTranslation();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const { setResponse, formResponses } = useFormResponseStore();
  const { data: allUsers } = useGetAllUsers();

  // Memoize current response to prevent recalculation on every render
  const currentResponse = useMemo(() => {
    return (
      formResponses
        [sectionId]?.questions[question.id]
        ?.response || []
    );
  }, [formResponses, sectionId, question.id]);

  // Initialize with existing response - only run once when component mounts
  useEffect(() => {
    if (!isInitialized && currentResponse && Array.isArray(currentResponse)) {
      setSelectedUsers(currentResponse);
      setIsInitialized(true);
    }
  }, [currentResponse, isInitialized]);

  const getFilteredUsers = (): User[] => {
    switch (question.userSelectionType) {
      case "all-users":
        return allUsers || [];
      case "specific-roles":
        // For now, return all users when specific roles are selected
        // This would need to be implemented with a proper API endpoint
        return allUsers || [];
      default:
        return allUsers || [];
    }
  };

  const handleUserSelect = (user: User) => {
    if (question.allowMultipleSelections) {
      // Check if user is already selected
      const isAlreadySelected = selectedUsers.some((u) => u.id === user.id);
      if (isAlreadySelected) {
        return; // User already selected
      }

      // Check maximum selections limit
      if (
        question.maxUserSelections &&
        selectedUsers.length >= question.maxUserSelections
      ) {
        return; // Maximum selections reached
      }

      const newSelectedUsers = [...selectedUsers, user];
      setSelectedUsers(newSelectedUsers);
      setResponse(
        sectionId,
        sectionName,
        question.id,
        question.type,
        question.label || "",
        newSelectedUsers
      );
    } else {
      // Single selection
      setSelectedUsers([user]);
      setResponse(
        sectionId,
        sectionName,
        question.id,
        question.type,
        question.label || "",
        [user]
      );
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleUserRemove = (userId: string) => {
    const newSelectedUsers = selectedUsers.filter((u) => u.id !== userId);
    setSelectedUsers(newSelectedUsers);
    setResponse(
      sectionId,
      sectionName,
      question.id,
      question.type,
      question.label || "",
      newSelectedUsers
    );
  };

  const filteredUsers = useMemo(() => {
    return getFilteredUsers().filter(
      (user) =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm, question.userSelectionType]);

  const isDisabled =
    question.allowMultipleSelections && question.maxUserSelections
      ? selectedUsers.length >= question.maxUserSelections
      : false;

  // Validation - separate effect with proper dependencies
  useEffect(() => {
    if (question.required === "yes" && selectedUsers.length === 0) {
      setValidationErrors(
        sectionId,
        question.id,
        `${question.label} ${t('forms.isRequired')}`
      );
    } else {
      setValidationErrors(sectionId, question.id, null);
    }
  }, [selectedUsers]);

  return (
    <div className="mb-4">
      <label className="main-label">
        {question.label}{" "}
        {question.required === "yes" && <span className="text-red-500">*</span>}
      </label>

      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className="mb-3 space-y-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 bg-subprimary rounded-md"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user.photo ? `/api/uploads/${user.photo}` : undefined}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-sm bg-gray-100 text-gray-600">
                    {user.firstName && user.lastName
                      ? `${user.firstName[0]}${user.lastName[0]}`
                      : user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  {user.email && (
                    <p className="text-sm text-gray-500">{user.email}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleUserRemove(user.id)}
                className="text-red-500 hover:text-red-700"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* User Selection */}
      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              disabled={isDisabled}
              className={cn(
                "w-full justify-between",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="text-left">
                {selectedUsers.length === 0
                  ? "Select users..."
                  : `${selectedUsers.length} user${
                      selectedUsers.length > 1 ? "s" : ""
                    } selected`}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search users..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty>
                  No users found matching your search.
                </CommandEmpty>
                <CommandGroup>
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={`${user.firstName} ${user.lastName} ${
                        user.email || ""
                      }`}
                      onSelect={() => handleUserSelect(user)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUsers.some((u) => u.id === user.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={
                              user.photo
                                ? `/api/uploads/${user.photo}`
                                : undefined
                            }
                            alt={`${user.firstName} ${user.lastName}`}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-sm bg-gray-100 text-gray-600">
                            {user.firstName && user.lastName
                              ? `${user.firstName[0]}${user.lastName[0]}`
                              : user.email?.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          {user.email && (
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Help Text */}
      {question.allowMultipleSelections && question.maxUserSelections && (
        <p className="mt-2 text-sm text-gray-500">
          Maximum {question.maxUserSelections} user
          {question.maxUserSelections > 1 ? "s" : ""} can be selected
        </p>
      )}
    </div>
  );
};

