import Head from 'next/head';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Card,
  TextField,
  CardActions,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  CardContent,
  Avatar,
  Divider
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { useRouter } from 'next/router';
import { string, array, object as yupObject } from "yup";
import { useFormik } from 'formik';
import SportService from 'api/SportService';
import { useEffect, useRef, useState } from 'react';
import { imageUrlToBase64 } from 'helpers/functions';

const Page = () => {

  const sportService = new SportService();
  const router = useRouter();

  const sportId = router?.query?.id ?? null;

  const initialFormDataValues = {
    name: "",
    description: "",
    is_enabled: false,
  }

  const formDataValidateSchema = yupObject().shape({
    name: string().required('Name is required'),
  });

  const initialTouched = {
    name: false,
    description: false,
    is_enabled: false
  }

  const formik = useFormik({
    validationSchema: formDataValidateSchema,
    initialValues: initialFormDataValues,
    initialTouched: initialTouched,
    onSubmit: async (values) => {
      try {
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

    if (sportId) {
      sportService.getSport(sportId).then(async (response) => {

        let sportData = { ...response.data.data };

        if (sportData.icon) {
          sportData.icon = await imageUrlToBase64(sportData.icon);
        }

        formik.setValues(sportData);
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
    if (sportId) {

      sportService.update(data).then((response) => {

      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    } else {
      sportService.create(data).then((response) => {
        router.push('/sports');
      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    }

  }

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Trigger the file input dialog
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    // Handle the selected file
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Add your logic to handle the selected file

      const reader = new FileReader();

      reader.onloadend = () => {
        //setPreviewImage(reader.result);
        formik.setFieldValue('icon', reader.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <Head>
        <title>
          Spory | Liber
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
                    Sport
                  </Typography>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
                  </Stack>
                </Stack>
              </Stack>

              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Avatar
                          src={formik.values.icon}
                          sx={{
                            height: 143,
                            width: 143
                          }}
                        />
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      <input
                        type="file"
                        accept="image/*" // Specify accepted file types (images in this case)
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                      <Button
                        fullWidth
                        variant="text"
                        onClick={handleButtonClick}
                      >
                        Select Picture
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >
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
                            label="Name"
                            name="name"
                            value={formik.values.name}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={!!(formik.touched.name && formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                          />

                          <FormControl component="fieldset">
                            <FormGroup>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formik.values.is_enabled}
                                    onChange={formik.handleChange}
                                    name="is_enabled"
                                  />
                                }
                                label="Is Enabled"
                              />
                            </FormGroup>
                          </FormControl>
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
                            label="Description"
                            name="description"
                            multiline
                            value={formik.values.description}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('description')}
                            error={!!(formik.touched.description && formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description ? formik.errors.description : ""}
                          />
                        </Stack>

                      </Grid>
                      <Grid
                        xs={12}
                        md={12}
                        lg={12}
                      >

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
                </Grid>
              </Grid>

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
