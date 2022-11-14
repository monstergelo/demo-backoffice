import React from "react";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import * as yup from "yup";

const form = {
  title: 'Admin Form',
  fields: [
    {
      name: 'name',
      label: 'name',
      type: 'text',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'email',
      label: 'email',
      type: 'text',
      fieldSize: 12,
      required: true,
      customValidation: yup.string().email('email format is not correct')
    },
    {
      name: 'password',
      label: 'password',
      type: 'text',
      fieldSize: 12,
      required: true,
      customValidation: yup.string().min(8, 'minimum 8 characters'),
    },
  ]
}

const AdminForm = ({ onSubmitRedirect }: FormProps) => {

  const { post } = useFetch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const response = await post('/admin', { body: data })

    if ( response?.data ) {
      router.push(onSubmitRedirect)
    }
  }

  const { FormRender } = useGenericForm({
    ...form,
    onSubmit
  })

  return (
    <>
      <FormRender />
    </>
  )
}

export default AdminForm