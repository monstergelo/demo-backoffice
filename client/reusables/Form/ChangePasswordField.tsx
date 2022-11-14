import React from "react";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import { FormFieldType } from "reusables/Form/types";
import { UseFormReturn } from "react-hook-form";

export interface ChangePasswordFieldProps {
  field: FormFieldType;
  form: UseFormReturn;
}

export const ChangePasswordField = ({field, form}: ChangePasswordFieldProps) => {
  const [isChangePassword, setIsChangePassword] = React.useState(0)
  const error = !!form?.formState.errors[field?.name]
  const errMsg = form?.formState?.errors[field?.name]?.message?.toString() ?? ''


  return (
    <>
      {isChangePassword > 0
        ?
          <TextField
            {...form?.register(field?.name)}
            disabled={form?.formState?.isSubmitting}
            fullWidth
            label={field?.label}
            error={error}
            helperText={errMsg}
          />
        :
          <FormControl>
            <Button variant="contained" color="warning" onClick={() => {setIsChangePassword((prev) => prev + 1)}}>
              Change Password
            </Button>
            {
              error
                ? <FormHelperText error>{errMsg}</FormHelperText>
                : <></>
            }
            
          </FormControl>
          
      }
    </>
  )
}