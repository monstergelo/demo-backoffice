import React from "react";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import { form } from "./constant";
import { Box, Button, Divider, Typography } from "@mui/material";
import { East } from "@mui/icons-material";
import NextLink from "reusables/NextLink";

const FDSForm = ({ paths, data }: FormProps) => {
  const { put } = useFetch();

  const onSubmit = async (data: any) => {
    const submitData = {
      ...data,
    }
    
    await put('/fds', { body: submitData })
  }

  const { FormRender } = useGenericForm({
    ...form,
    onSubmit,

    formOptions: {
      defaultValues: data,
    }
  })

  return (
    <>
      <FormRender />

      <Box display="flex" justifyContent="flex-end" sx={{width: '100%'}}>
        <NextLink href={paths.card}>
          <Button variant="contained" color="success" endIcon={<East />}>
            <Typography variant="h6" component="div">
              Card Tracking
            </Typography>
          </Button>
        </NextLink>
      </Box>
    </>
  )
}

export default FDSForm