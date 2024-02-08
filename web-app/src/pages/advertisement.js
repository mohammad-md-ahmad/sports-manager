import Head from 'next/head';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
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
  CardActions
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CompanyCard } from 'src/sections/companies/company-card';
import { CompaniesSearch } from 'src/sections/companies/companies-search';
import { useCallback, useEffect, useState } from 'react';
import CompanyService from 'api/CompanyService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAuthContext } from 'src/contexts/auth-context';
import { useRouter } from 'next/router';
import MiscService from 'api/MiscService';
import { string, array, object as yupObject } from "yup";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AdService from 'api/AdService';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

const Page = () => {

  const adService = new AdService();
  const miscService = new MiscService();
  const router = useRouter();

  const adId = router?.query?.id ?? null;

  const initialFormDataValues = {
    title: "",
    description: "",
    url: "",
    effective_from: "",
  }

  const formDataValidateSchema = yupObject().shape({
    title: string().required('Title is required'),
    effective_from: string().required('Effective from is required'),
  });

  const initialTouched = {
    name: false,
    description: false,
    url: false,
    effective_from: false,
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

    if (adId) {
      adService.getAd(adId).then((response) => {
        let adData = { ...response.data.data };
        formik.setValues(adData);
      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    }

  }, [])


  const submitForm = (values) => {
    let data = { ...values }
    if (data['effective_from'])
      data['effective_from'] = format(data['effective_from'], 'dd-MM-yyyy')
    if (adId) {
      adService.update(data).then((response) => {
      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    } else {
      adService.create(data).then((response) => {
      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    }

  }

  const handleDateChange = (date) => {
    // Update the effective_from field
    formik.setFieldValue('effective_from', date);

    // // Format the date and update the formatted_effective_from field
    // formik.setFieldValue(
    //   'effective_from',
    //   date ? format(date, 'dd-MM-yyyy') : ''
    // );
  };

  return (
    <>
      <Head>
        <title>
          Ad| Liber
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
                    Advertisement
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
                  py: 3,
                }}>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    xs={12}
                    md={6}
                    lg={6}
                  >
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formik.values.title}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={!!(formik.touched.title && formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title ? formik.errors.title : ""}
                      />

                      <DatePicker
                        fullWidth
                        label="Effective From"
                        name="effective_from"
                        value={formik.values.effective_from}
                        onBlur={formik.handleBlur}
                        onChange={handleDateChange}
                        error={!!(formik.touched.effective_from && formik.errors.effective_from)}
                        helperText={formik.touched.effective_from && formik.errors.effective_from ? formik.errors.effective_from : ""}
                        renderInput={(params) => <TextField {...params} />}
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
                        label="Url"
                        name="url"
                        value={formik.values.url}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('url')}
                        error={!!(formik.touched.url && formik.errors.url)}
                        helperText={formik.touched.url && formik.errors.url ? formik.errors.url : ""}
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
                      label="Description"
                      name="description"
                      multiline
                      value={formik.values.description}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange('description')}
                      error={!!(formik.touched.description && formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description ? formik.errors.description : ""}
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
