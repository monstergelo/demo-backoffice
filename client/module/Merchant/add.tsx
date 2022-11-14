import React from "react";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import { form } from "./constant";

const MerchantForm = ({ onSubmitRedirect, type }: FormProps) => {
  const { post } = useFetch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const submitData: any = {
      ...data,
      type
    };
    
    const response = await post('/merchant', { body: submitData })

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

export default MerchantForm