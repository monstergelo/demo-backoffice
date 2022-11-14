import React from "react";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import { form, getPermissionsArray } from "./constant";

const RoleForm = ({ onSubmitRedirect }: FormProps) => {

  const { post } = useFetch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const submitData: any = {
      name: data?.name,
      permissions: JSON.stringify(getPermissionsArray(data))
    };
    
    const response = await post('/role', { body: submitData })

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

export default RoleForm