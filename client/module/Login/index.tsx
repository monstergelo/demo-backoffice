import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, TextField, CircularProgress  } from "@mui/material";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useRouter } from "next/router";
import { useFetch } from "module/BasePage";

const Login = () => {
  const [user, setUser] = useState()
  const { register, handleSubmit, formState: {isSubmitting} } = useForm();
  const { post } = useFetch()
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const response = await post('/login', { body: data });
    localStorage.setItem('user', JSON.stringify(response?.data))
    setUser(response?.data)
  };

  useEffect(() => {
    if (user && !isSubmitting) {
      router.push('/')
    }
  }, [user, isSubmitting, router])

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={1}>
        <Image
          src="/logoipsum.svg"
          width={240}
          height={240}
          alt="logo"
        />
      </Grid>
      
      <Grid item xs={1}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box display="flex" alignItems="center">
            <TextField
              disabled={isSubmitting}
              label="username"
              {...register('name')}
            /> 
            <Typography variant="caption" color="grey">userTest</Typography>
          </Box>
          <Box  display="flex" alignItems="center">
            <TextField
              disabled={isSubmitting}
              label="password"
              type="password"
              {...register('password')}
            />
            <Typography variant="caption" color="grey">test</Typography>
          </Box>
          <Box display="flex" justifyContent="center">
            <Button disabled={isSubmitting} fullWidth type="submit" variant="contained" sx={{m: 1}}>
              {isSubmitting ? <CircularProgress /> : "Submit"}
            </Button>
          </Box>
        </Box>
      </Grid>
      
    </Grid>
  );
};

export default Login;
