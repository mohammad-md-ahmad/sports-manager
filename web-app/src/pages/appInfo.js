import Head from 'next/head';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Card,
  TextField,
  Select,
  Autocomplete,
  CardActions,
  CardHeader
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import AppInfoService from 'api/AppInfoService';
import MiscService from 'api/MiscService';
import { string, array, object as yupObject } from "yup";
import { useFormik } from 'formik';

const Page = () => {

  const appInfoService = new AppInfoService();

  const initialFormDataValues = {
    about: "",
    email: "",
    phone: "",
  }

  const formDataValidateSchema = yupObject().shape({
    about: string().required('About is required'),
    email: string().required('Email is required'),
    phone: string().required('Phone is required'),
  });

  const initialTouched = {
    about: false,
    email: false,
    phone: false,
  }

  const formik = useFormik({
    validationSchema: formDataValidateSchema,
    initialValues: initialFormDataValues,
    initialTouched: initialTouched,
    onSubmit: async (values) => {
      try {
        console.log('validating');
        console.log(values);
        // Validate the form values using the validation schema
        await formDataValidateSchema.validate(values, { abortEarly: false });

        // If validation succeeds, you can proceed with your submit logic
        submitForm(values);
      } catch (errors) {
        // If validation fails, log the errors to the console
        console.error('Form validation errors:', errors);
      }
    }
  });


  useEffect(() => {

    appInfoService.list().then((response) => {
      let appInfo = arrayToObject([...response.data?.data?.data]);
      console.log(appInfo);
      formik.setValues(appInfo);
    }).catch((error) => {
      // Handle API request errors here
      console.error(error);
      //throw new Error('Please check your email and password');
      throw new Error(error.message);
    });

  }, [])

  const arrayToObject = (array) => {
    return array.reduce((acc, obj) => {
      const lowercaseKey = obj.key.toLowerCase();
      acc[lowercaseKey] = obj.value;
      return acc;
    }, {});
  };

  const objectToArray = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      // Handle the case where 'obj' is not an object
      return [];
    }

    return Object.entries(obj).map(([key, value]) => ({
      key: key.toLowerCase(),
      value,
    }));
  };


  const submitForm = (values) => {
    let data = objectToArray({ ...values });
    console.log(data);
    appInfoService.save({ 'app_info': data }).then((response) => {

    }).catch((error) => {
      // Handle API request errors here
      console.error(error);
      //throw new Error('Please check your email and password');
      throw new Error(error.message);
    });

  }

  return (
    <>
      <Head>
        <title>
          App Info | Liber
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">
                    App Info
                  </Typography>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
                  </Stack>
                </Stack>
              </Stack>
              <Card style={{ width: "100%" }}
                sx={{
                  px: 3,
                  pb: 3
                }}>
                <Grid
                  container
                  spacing={3}
                  mt={3}
                >
                  <Grid
                    xs={12}
                    md={6}
                    lg={6}
                  >
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        required
                        label="Emial"
                        name="email"
                        value={formik.values?.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('email')}
                        error={!!(formik.touched.email && formik.errors?.email)}
                        helperText={formik.touched.email && formik.errors?.email ? formik.errors?.email : ""}
                      />

                    </Stack>

                  </Grid>
                  <Grid
                    xs={12}
                    md={6}
                    lg={6}
                  >
                    <Stack spacing={3}>

                      <TextField
                        fullWidth
                        required
                        label="Phone"
                        name="phone"
                        value={formik.values?.phone}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('phone')}
                        error={!!(formik.touched.phone && formik.errors?.phone)}
                        helperText={formik.touched.phone && formik.errors?.phone ? formik.errors?.phone : ""}
                      />

                    </Stack>

                  </Grid>
                  <Grid
                    xs={12}
                    md={12}
                    lg={12}
                  >
                    <TextField
                      fullWidth
                      required
                      label="About"
                      name="about"
                      multiline
                      rows={4}
                      value={formik.values?.about}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange('about')}
                      error={!!(formik.touched.about && formik.errors?.about)}
                      helperText={formik.touched.about && formik.errors?.about ? formik.errors?.about : ""}
                    />

                  </Grid>
                </Grid>
                <CardActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <CheckCircleIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                    type="submit"
                  >
                    Save
                  </Button>
                </CardActions>
              </Card>
            </Stack>
          </Container>
        </form>
      </Box >
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
