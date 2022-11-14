import React, { useContext } from "react";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import { Button, TextField } from "@mui/material";
import { FormFieldType, FormType } from "reusables/Form/types";
import { UseFormReturn } from "react-hook-form";
import { BasicLayoutContext } from "module/BasicLayout";
import * as yup from "yup";

interface ChangePasswordFieldProps {
  field: FormFieldType;
  form: UseFormReturn;
}

const ChangePasswordField = ({field, form}: ChangePasswordFieldProps) => {
  const [isChangePassword, setIsChangePassword] = React.useState(false)

  return (
    <>
      {isChangePassword
        ?
          <TextField
            {...form?.register(field?.name)}
            disabled={form?.formState?.isSubmitting}
            fullWidth
            label={field?.label}
            error={!!form?.formState.errors[field?.name]}
            helperText={form?.formState?.errors[field?.name]?.message?.toString() ?? ''}
          />
        :
          <Button variant="contained" color="warning" onClick={() => {setIsChangePassword(true)}}>
            Change Password
          </Button>
      }
    </>
  )
}

const form: FormType = {
  title: 'Admin Form',
  fields: [
    {
      name: 'name',
      label: 'name',
      type: 'text',
      fieldSize: 12,
      required: false,
    },
    {
      name: 'email',
      label: 'email',
      type: 'text',
      fieldSize: 12,
      required: false,
      customValidation: yup.string().email('email format is not correct')
    },
    {
      name: 'role',
      label: 'Role',
      type: 'autocomplete',
      option: 'role',
      fieldSize: 12,
      required: false,
    },
    {
      name: 'password',
      label: 'password',
      type: 'changePassword',
      fieldSize: 12,
      required: false,
      customValidation: yup.string().min(8, 'minimum 8 characters'),
    },
  ],
  onSubmit: (data) => { console.log(data) }
}

const AdminForm = ({ onSubmitRedirect, data, id, options }: FormProps) => {
  const { refreshSidebar } = useContext(BasicLayoutContext)
  const { put } = useFetch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const submitData = {
      ...data,
      role_id: data?.role?.id,
    }
    const response = await put('/admin/' + id, { body: submitData })
    refreshSidebar()

    if ( response?.data ) {
      router.push(onSubmitRedirect)
    }
  }

  const { FormRender } = useGenericForm({
    ...form,
    options,
    onSubmit,

    formOptions: {
      defaultValues: {
        ...data,
        role: data?.role_id && data?.role_name ? {
          id: data?.role_id,
          label: data?.role_name
        }: null
      }
    },
  })

  return (
    <>
      <FormRender />
    </>
  )
}

export default AdminForm