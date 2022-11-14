import React, { useContext } from "react";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import { form, getPermissionsArray, getPermissionsDefaultValue } from "./constant";
import { BasicLayoutContext } from "module/BasicLayout";

const RoleForm = ({ onSubmitRedirect, data, id }: FormProps) => {
  const { refreshSidebar } = useContext(BasicLayoutContext)
  const { put } = useFetch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const submitData: any = {
      name: data?.name,
      permissions: JSON.stringify(getPermissionsArray(data))
    };
    
    const response = await put(`/role/${id}`, { body: submitData })
    refreshSidebar()

    if ( response?.data ) {
      router.push(onSubmitRedirect)
    }
  }

  const { FormRender } = useGenericForm({
    ...form,
    onSubmit,

    formOptions: {
      defaultValues: {
        ...data,
        ...getPermissionsDefaultValue(data)
      }
    },
  })

  return (
    <>
      <FormRender />
    </>
  )
}

export default RoleForm