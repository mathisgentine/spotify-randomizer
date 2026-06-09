"use client"

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react"
import { markets } from "../../utils/market";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxMarketProps {
    selectedMarket: string | null;
    onSelectMarket: (market: string | null) => void;
  }
  
  export const ComboboxMarket: React.FC<ComboboxMarketProps> = ({
    selectedMarket,
    onSelectMarket,
  }) => {
    const [open, setOpen] = useState(false);
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedMarket
              ? markets.find((market) => market.label === selectedMarket)?.label
              : "Select a country..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." className="h-9" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {markets.map((market) => (
                  <CommandItem
                    key={market.value}
                    value={market.label}
                    onSelect={(currentValue) => {
                      const newSelection =
                        currentValue === selectedMarket ? null : currentValue;
                      onSelectMarket(newSelection);
                      setOpen(false);
                    }}
                  >
                    {market.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedMarket === market.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };