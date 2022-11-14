import React from "react";
import { Box, Button, CircularProgress, Grid, Paper, TextField, Typography  } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormType } from "./types"
import { yupValidator } from "./utility"
import renderField from "./FormField";


const useGenericForm = (formParameter: FormType) => {
  const fieldSchema = formParameter.fields?.reduce((schema, field) => {
    return {
      ...schema,
      [field.name]: yupValidator(field)
    }
  }, {})

  const form = useForm({
    resolver: yupResolver(yup.object().shape(fieldSchema)),
    ...formParameter?.formOptions
  });

  const { handleSubmit, formState } = form

  const FormRender = () => (
    <Paper elevation={1}>
      <Box paddingX={4} paddingTop={2}>
        <Typography
          variant="h4"
        >
          {formParameter?.title}
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
        onSubmit={handleSubmit(formParameter?.onSubmit)}
      >
        {formParameter && formParameter?.fields?.map((field) => (
          <Grid key={field?.name} item xs={field?.fieldSize}>
            {renderField(field, form, formParameter?.options)}
          </Grid>
        ))}
        
        <Grid display="flex" justifyContent="flex-end" item xs={12}>
          <Button variant="contained" type="submit">
            {formState?.isSubmitting ? <CircularProgress color="secondary" size={20} /> : '' }Submit
          </Button>
        </Grid>
      </Grid> 
    </Paper>
  )

  return {
    FormRender,
    ...form,
  }
}

export default useGenericForm;