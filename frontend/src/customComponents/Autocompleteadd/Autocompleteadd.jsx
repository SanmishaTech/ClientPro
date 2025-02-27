import React, { useState, useEffect, useMemo } from "react";
import { AutoComplete } from "@/components/ui/autocomplete";
const Autocompeleteadd = ({
  options,
  placeholder,
  emptyMessage,
  defautValues,
  value,
  onValueChange,
  variable,
  disabled,
  setarray,
  isLoading = false,
}) => {
  const [takeinput, setTakeinput] = useState();

  useEffect(() => {
    if (takeinput) {
      setarray((prev) => ({
        ...prev,
        [variable]: [...(prev?.companyName || []), takeinput],
      }));
    }
  }, [takeinput, setarray, variable]);

  const memoizedOptions = useMemo(() => options, [options]);
  return (
    <AutoComplete
      options={memoizedOptions}
      placeholder={placeholder}
      emptyMessage={emptyMessage}
      value={value}
      defaultValue={defautValues}
      takeinput={takeinput}
      setTakeinput={setTakeinput}
      onValueChange={onValueChange}
    />
  );
};

export default Autocompeleteadd;
