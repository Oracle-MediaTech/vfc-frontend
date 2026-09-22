"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  CommandList,
} from "@/components/ui/command";

type DepartmentOption = {
  id: string;
  name: string;
};

type DeptPickerProps = {
  label: string;
  hint?: string;
  options: DepartmentOption[];
  value: string[];
  onChange: (next: string[]) => void;
};

export function DeptPicker({
  label,
  hint,
  options,
  value,
  onChange,
}: DeptPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedDepts = useMemo(
    () => options.filter((d) => value.includes(d.id)),
    [options, value],
  );

  const unselectedDepts = useMemo(
    () => options.filter((d) => !value.includes(d.id)),
    [options, value],
  );

  const addDept = (id: string) => {
    if (!value.includes(id)) {
      onChange([...value, id]);
    }
    setOpen(false);
  };

  const removeDept = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}

      {/* Selected badges */}
      {selectedDepts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDepts.map((dept) => (
            <span
              key={dept.id}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 pl-3 pr-1 py-1 text-xs font-medium text-emerald-700"
            >
              {dept.name}
              <button
                type="button"
                onClick={() => removeDept(dept.id)}
                className="rounded-full p-1 hover:bg-emerald-100 hover:text-red-500"
                aria-label={`Remove ${dept.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between"
          >
            <span className="truncate text-left">
              {unselectedDepts.length > 0
                ? "Select department..."
                : "All departments selected"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search departments..." />
            <CommandList>
              <CommandEmpty>No departments found.</CommandEmpty>

              <CommandGroup>
                {unselectedDepts.map((dept) => (
                  <CommandItem
                    key={dept.id}
                    value={dept.name}
                    onSelect={() => addDept(dept.id)}
                    className="cursor-pointer"
                  >
                    <span className="flex-1">{dept.name}</span>
                    <Check className="h-4 w-4 opacity-0" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
