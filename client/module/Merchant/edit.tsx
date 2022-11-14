import React from "react";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";
import useGenericForm from "reusables/Form";
import { FormProps } from "module/types";
import { Box, Divider, Grid, Link, Paper, Typography } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { documents, details } from './constant';
import * as yup from "yup";

const form = {
  title: 'Merchant Form',
  fields: [
    {
      name: 'name',
      label: 'name',
      type: 'text',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'verified',
      label: 'Verified',
      type: 'boolean',
      fieldSize: 12,
      required: true,
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'text',
      fieldSize: 12,
      required: true,
      customValidation: yup.string().url('url format is not correct')
    },
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      fieldSize: 12,
      required: true,
      customValidation: yup.string().email('email format is not correct')
    },
    {
      name: 'password',
      label: 'Password',
      type: 'changePassword',
      fieldSize: 12,
      required: true,
      customValidation: yup.string().min(8, 'minimum 8 characters'),
    },
  ]
}



const MerchantForm = ({ onSubmitRedirect, data, id, type }: FormProps) => {
  const { put } = useFetch();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const submitData: any = {
      ...data,
      type
    };
    
    const response = await put(`/merchant/${id}`, { body: submitData })

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
      }
    },
  })

  return (
    <>
      <FormRender />

      {data?.detail_id && (
        <Paper elevation={1}>
          <Box paddingX={4} paddingTop={2}>
            <Typography
              variant="h4"
            >
              Merchant Details
            </Typography>
          </Box>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="left"
            paddingBottom={4}
            paddingX={4}
            marginY={2}
            component="form"
          >
            {documents?.map((document: any) => data[document?.id] && (
              <Grid key={document.id} item xs={12}>
                <Link href={data[document?.id]} target="_blank">
                  <Box display="flex" justifyContent="flex-start" alignItems="center"> 
                    <AttachFileIcon fontSize="small" /> {document.label}
                  </Box>
                </Link>
              </Grid>
            ))}

            <Grid item xs={12}><Divider /></Grid>

            {details?.map((detail: any) => data[detail?.id] && (
              <React.Fragment key={detail?.id}>
                <Grid item xs={3} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">{detail.label}</Typography>
                  <Typography variant="body1">:</Typography>
                </Grid>
                <Grid item xs={9} display="flex" alignItems="center" sx={{position: 'relative', top: '2px'}}>
                  <Typography variant="body2">{data[detail?.id]}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid> 
        </Paper>
      )}
    </>
  )
}

export default MerchantForm