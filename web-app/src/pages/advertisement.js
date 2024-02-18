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
  CardContent
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

import { string, object as yupObject } from "yup";
import { useFormik } from 'formik';
import AdService from 'api/AdService';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { imageUrlToBase64 } from 'helpers/functions';

const Page = () => {
  const router = useRouter();
  const adService = new AdService();
  const adId = router?.query?.id ?? null;

  const initialFormDataValues = {
    title: "",
    description: "",
    url: "",
    effective_from: null,
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
        let date = new Date(`${adData['effective_from'].replace(' ', 'T')}.000Z`);
        adData['effective_from'] = date;//date.toISOString();

        loadImageData(adData);

        formik.setValues(adData);
      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    }

  }, []);


  const auth = useAuth();
  const loadImageData = async (adData) => {
    auth.setLoading(true);
    try {
      const base64Array = await Promise.all(
        adData.gallery.map(async item => await imageUrlToBase64(item.image))
      );
      setBase64Images(base64Array);
    } catch (error) {
      console.error('Error loading image data:', error);
    } finally {
      auth.setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  const submitForm = (values) => {
    let data = { ...values }
    if (data['effective_from'])
      data['effective_from'] = format(data['effective_from'], 'yyyy-MM-dd HH:mm:ss')

    data['photos'] = base64Images;

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
    formik.setFieldValue('effective_from', date);
  };


  const [selectedImages, setSelectedImages] = useState([]);
  const [base64Images, setBase64Images] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // Update selectedImages state
    setSelectedImages(files);

    // Convert each image to base64 and update base64Images state
    Promise.all(files.map(file => convertFileToBase64(file)))
      .then(base64Array => setBase64Images(base64Array))
      .catch(error => console.error('Error converting images to base64:', error));
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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

                  <Grid
                    xs={12}
                    md={12}
                    lg={12}
                  >
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        multiple
                        onChange={handleFileChange}
                        id="image-upload-input"
                      />

                      <CardActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
                        <label htmlFor="image-upload-input">
                          <Button variant="contained" component="span">
                            Upload Images
                          </Button>
                        </label>
                      </CardActions>

                      <Grid container spacing={2}>
                        {base64Images.map((image, index) => (
                          <Grid item key={index} xs={4}>
                            <Card>
                              <CardContent>
                                <img
                                  src={base64Images[index]}
                                  alt={`Image ${index + 1}`}
                                  style={{ maxWidth: '100%', maxHeight: '150px' }}
                                />
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
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
