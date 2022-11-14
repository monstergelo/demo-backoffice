import { Autocomplete, Box, Divider, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { FetchContext } from "module/BasePage/FetchProvider";
import React, { useContext, useEffect } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { FormFieldType } from "./types";

export interface ReferenceFieldProps {
  fieldParam: FormFieldType;
  form: UseFormReturn
}

export const ReferenceField = ({fieldParam, form}: ReferenceFieldProps) => {
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState([]);
  const loading = options.length === 0;

  const { get } = useContext(FetchContext);

  useEffect(() => {
    const getOptions = async () => {
      const response = await get(fieldParam.url ?? '', { params: {q: inputValue} })

      setOptions(response ?? [])
    }
    getOptions()
  }, [inputValue, fieldParam.url, get])

  return (
    <Controller
      control={form.control}
      name={fieldParam?.name}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          filterOptions={(x) => x}
          options={options}
          onChange={(_, values) => onChange(values)}
          onInputChange={(_, value) => setInputValue(value)}
          loading={loading}
          value={value}
          renderInput={(params) => (
            <TextField
              {...params}
              label={fieldParam?.label}
              variant="outlined"
              onChange={onChange}
            />
          )}
        />
      )}
    />
  )
}