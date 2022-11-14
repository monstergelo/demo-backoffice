import React from "react";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import { form, options } from "./constant";

const DisbursementForm = ({ onSubmitRedirect }: FormProps) => {

  const { post } = useFetch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const submitData = {
      ...data,
      status: data?.["status"]?.id,
      bank_account_id: data?.["bank-account"]?.id,
      merchant_id: data?.["merchant"]?.id,
    }
    const response = await post('/disbursement', { body: submitData })

    if ( response?.data ) {
      router.push(onSubmitRedirect)
    }
  }

  const { FormRender } = useGenericForm({
    ...form,
    onSubmit,

    options
  })

  return (
    <>
      <FormRender />
    </>
  )
}

export default DisbursementForm