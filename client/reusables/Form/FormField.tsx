import { Autocomplete, Box, Divider, FormControlLabel, Switch, TextField, Typography } from "@mui/material";
import { UseFormReturn, Controller } from "react-hook-form";
import { ChangePasswordField } from "./ChangePasswordField";
import { ReferenceField } from "./ReferenceField";
import { FormFieldType, option } from "./types";

const renderField = (field: FormFieldType, form: UseFormReturn, options?: {[x:string]: option[]}) => {
  if (field?.customRender) {
    return field?.customRender(field, form)
  }

  const { register, formState } = form

  switch (field?.type) {
    case 'text':
      return (
        <TextField
          {...register(field?.name)}
          disabled={formState?.isSubmitting}
          fullWidth
          label={field?.label}
          error={!!formState.errors[field?.name]}
          helperText={formState?.errors[field?.name]?.message?.toString() ?? ''}
        />
      )
      break;

    case 'number':
      return (
        <TextField
          {...register(field?.name)}
          type="number"
          disabled={formState?.isSubmitting}
          fullWidth
          InputProps={{ inputProps: { min: 1 } }}
          label={field?.label}
          error={!!formState.errors[field?.name]}
          helperText={formState?.errors[field?.name]?.message?.toString() ?? ''}
        />
      )
      break;

    case 'changePassword':
      return (
        <ChangePasswordField field={field} form={form} />
      )
      break;

    case 'boolean':
      return (
        <FormControlLabel
          control={
            <Switch
              color="primary"
              defaultChecked={form.getValues(field?.name)}
              {...register(field?.name)}
            />
          }
          label={field?.label}
        />
      )
      break;

    case 'autocomplete':
      return (
        <Controller
          control={form.control}
          name={field?.name}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={field?.option && options ? options?.[field?.option] : []}
              onChange={(_, values) => onChange(values)}
              value={value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={field?.label}
                  variant="outlined"
                  onChange={onChange}
                />
              )}
            />
          )}
        />
      )
      break;

      case 'reference':
        return (
          <ReferenceField fieldParam={field} form={form} />
        )
        break;

    case 'section':
      return (
        <Box sx={{width: '100%'}}>
          <Typography variant="h6" component="div">
            {field?.label}
          </Typography>
          <Divider variant="fullWidth" />
        </Box>
      )
      break;
  
    default:
      return <></>
      break;
  }
}

export default renderField