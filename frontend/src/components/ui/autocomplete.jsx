import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useState, useEffect, useRef, useCallback } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
//   CommandShortcut,
// } from "@/components/ui/command";

export const AutoComplete = ({
  options,
  placeholder,
  emptyMessage,
  defaultValue,
  value,
  onValueChange,
  disabled,
  takeinput,
  setTakeinput,
  isLoading = false,
}) => {
  const inputRef = useRef(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  // const [takeinput, setTakeinput] = useState(value?.label || "");

  // useEffect(() => {
  //   setTakeinput(takeinput);
  //   console.log(takeinput);
  // }, [takeinput]);

  useEffect(() => {
    setSelected(defaultValue);
    setTakeinput(defaultValue || "");
  }, [defaultValue]);

  const updateSelectedValue = useCallback(() => {
    if (takeinput !== selected?.label) {
      const newValue = {
        value: takeinput,
        label: takeinput,
      };

      setSelected(newValue);
      onValueChange(newValue);
    }
  }, [takeinput, onValueChange]);

  useEffect(() => {
    updateSelectedValue();
  }, [updateSelectedValue]);
  // useEffect(() => {
  //   if (takeinput !== selected.label) {
  //     const value = {
  //       value: takeinput,
  //       label: takeinput,
  //     };
  //     setSelected(takeinput);

  //     onValueChange(value);
  //   }
  // }, [selected, takeinput]);

  // useEffect(() => {
  //   console.log("value:", value);
  //   setSelected(value);
  // }, [value]);

  const handleKeyDown = useCallback(
    (event) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!isOpen) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
        const optionToSelect = options?.find(
          (option) => option.label === input.value
        );
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [isOpen, options, onValueChange]
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setTakeinput(selected?.label);
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption) => {
      setTakeinput(selectedOption.label);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange]
  );

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div>
        <CommandInput
          ref={inputRef}
          value={takeinput}
          onValueChange={isLoading ? undefined : setTakeinput}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="text-base"
        />
      </div>
      <div className="relative mt-1">
        <div
          className={cn(
            "animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-white outline-none",
            isOpen ? "block" : "hidden"
          )}
        >
          <CommandList className="rounded-lg ring-1 ring-slate-200">
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-8 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {options?.length > 0 && !isLoading ? (
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selected?.value === option.value;
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(option)}
                      className={cn(
                        "flex w-full items-center gap-2",
                        !isSelected ? "pl-8" : null
                      )}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
