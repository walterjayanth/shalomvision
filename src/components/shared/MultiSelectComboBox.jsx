import React, { useState, useMemo } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

export function MultiSelectComboBox({
  items,
  selectedIds,
  onSelectionChange,
  placeholder,
  itemIcon: Icon,
  renderItem, // Optional custom renderer for list items
}) {
  const [open, setOpen] = useState(false);

  const selectedItems = useMemo(() => {
    return items.filter(item => selectedIds.includes(item.id));
  }, [items, selectedIds]);

  const handleSelect = (currentValue) => {
    const newSelectedIds = selectedIds.includes(currentValue)
      ? selectedIds.filter((id) => id !== currentValue)
      : [...selectedIds, currentValue];
    onSelectionChange(newSelectedIds);
  };
  
  const handleRemove = (idToRemove) => {
    const newSelectedIds = selectedIds.filter((id) => id !== idToRemove);
    onSelectionChange(newSelectedIds);
  }

  const getItemTitle = (item) => item.name || item.title;

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto"
          >
            <div className="flex gap-1 flex-wrap">
              {selectedItems.length > 0 ? (
                selectedItems.map(item => (
                  <Badge
                    key={item.id}
                    variant="secondary"
                    className="mr-1 mb-1"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(item.id);
                    }}
                  >
                    {getItemTitle(item)}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedIds.includes(item.id) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <div className="flex items-center gap-2">
                      {renderItem ? renderItem(item) : (
                        <>
                          {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                          <span>{getItemTitle(item)}</span>
                        </>
                      )}
                    </div>
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