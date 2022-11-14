import React from "react";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import { form } from "./constant";

const DisbursementForm = ({ onSubmitRedirect, data, id, options }: FormProps) => {
  const { put } = useFetch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const submitData = {
      ...data,
      role_id: data?.role?.id,
    }
    const response = await put('/disbursement/' + id, { body: submitData })

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

export default DisbursementForm