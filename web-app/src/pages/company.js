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
  Autocomplete,
  CardActions,
  CardContent,
  Avatar,
  Divider
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useRef, useState } from 'react';
import CompanyService from 'api/CompanyService';

import { useRouter } from 'next/router';
import MiscService from 'api/MiscService';
import { string, array, object as yupObject } from "yup";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { imageUrlToBase64 } from 'helpers/functions';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {

  const companyService = new CompanyService();
  const miscService = new MiscService();
  const router = useRouter();

  const companyId = router?.query?.id ?? null;

  const initialFormDataValues = {
    name: "",
    description: "",
    createUserRequest: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    createAddressRequest: {
      line_1: "",
      city: "",
      region: "",
      postcode: "",
      geocode_data: {
        "lat": "34",
        "lng": "35"
      },
      country_uuid: ""
    }
  }

  const formDataValidateSchema = yupObject().shape({
    name: string().required('Name is required'),
    description: string().required('Description is required'),

    createAddressRequest: yupObject().shape({
      line_1: string().required('Line 1 is required'),
      city: string().required('City is required'),
      region: string().required('Region is required'),
      postcode: string().required('Postcode is required'),
      country_uuid: string().required('Country is required'),
    }),

    createUserRequest: companyId ? yupObject() : yupObject().shape({
      first_name: string().required('First name is required'),
      last_name: string().required('Last name is required'),
      username: string().required('Username is required'),
      email: string().required('Email is required'),
      password: string().min(8, 'Password must be at least 8 characters')
        .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol')
        .required('Password is required'),
      password_confirmation: string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Password confirmation is required'),
    }),

  });

  const initialTouched = {
    name: false,
    description: false,
    createUserRequest: {
      first_name: false,
      last_name: false,
      username: false,
      email: false,
      password: false,
      password_confirmation: false
    },
    createAddressRequest: {
      line_1: false,
      city: false,
      region: false,
      postcode: false,
      geocode_data: {
        "lat": false,
        "lng": false
      },
      country_uuid: false
    }
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


  const [countries, setCountries] = useState([]);
  const [selectCountry, setSelectCountry] = useState([]);

  useEffect(() => {
    miscService.lists().then((response) => {
      setCountries(response.data?.data?.countries);

      if (companyId) {
        companyService.getCompany(companyId).then(async (response) => {

          let companyData = { ...response.data.data };
          companyData['createAddressRequest'] = companyData['address'];

          delete companyData['address'];
          setSelectCountry(companyData?.createAddressRequest?.country);

          if (companyData.logo) {
            companyData.logo = await imageUrlToBase64(companyData.logo);
          }

          loadImageData(companyData);

          formik.setValues(companyData);
        }).catch((error) => {
          // Handle API request errors here
          console.error(error);
          //throw new Error('Please check your email and password');
          throw new Error(error.message);
        });
      }
    }).catch((error) => {
      console.error(error);
    });

  }, [])
  const auth = useAuth();

  const loadImageData = async (companyData) => {
    auth.setLoading(true);
    try {
      const base64Array = await Promise.all(
        companyData.gallery.map(async item => await imageUrlToBase64(item.image))
      );
      setBase64Images(base64Array);
    } catch (error) {
      console.error('Error loading image data:', error);
    } finally {
      auth.setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  const handleSelectChange = (field, value) => {
    setSelectCountry(value);
    formik.setFieldValue(field, value ? value['country_uuid'] : null);
  }

  const submitForm = (values) => {
    let data = { ...values }
    data['companyPhotos'] = base64Images;

    if (companyId) {
      data['address'] = data['createAddressRequest'];
      delete data['createAddressRequest'];

      companyService.update(data).then((response) => {

      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    } else {
      companyService.create(data).then((response) => {
        router.push('/companies');
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
        formik.setFieldValue('logo', reader.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const [base64Images, setBase64Images] = useState([]);

  const handleFilesChange = (event) => {
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
          Company | Liber
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
                    Company
                  </Typography>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >

                  </Stack>
                </Stack>
                <div>
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
                </div>
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
                          src={formik.values.logo}
                          sx={{
                            height: 120,
                            width: 120
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
                            required
                            label="Company Name"
                            name="name"
                            value={formik.values.name}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            error={!!(formik.touched.name && formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                          />

                          <TextField
                            fullWidth
                            required
                            label="Region"
                            name="region"
                            value={formik.values.createAddressRequest.region}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.region')}
                            error={!!(formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region)}
                            helperText={formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region ? formik.errors.createAddressRequest?.region : ""}
                          />

                          <TextField
                            fullWidth
                            required
                            label="Line 1"
                            name="line_1"
                            value={formik.values.createAddressRequest.line_1}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_1')}
                            error={!!(formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1)}
                            helperText={formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1 ? formik.errors.createAddressRequest?.line_1 : ""}
                          />

                          <TextField
                            fullWidth
                            label="Line 3"
                            name="line_3"
                            value={formik.values.createAddressRequest.line_3}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_3')}
                            error={!!(formik.touched.createAddressRequest?.line_3 && formik.errors.createAddressRequest?.line_3)}
                            helperText={formik.touched.createAddressRequest?.line_3 && formik.errors.createAddressRequest?.line_3 ? formik.errors.createAddressRequest?.line_3 : ""}
                          />

                        </Stack>

                      </Grid>
                      <Grid
                        xs={12}
                        md={6}
                        lg={6}
                      >
                        <Stack spacing={3}>

                          <Autocomplete
                            options={countries}
                            value={selectCountry}
                            getOptionLabel={option => option['name'] ?? ''}
                            onChange={(event, value) => handleSelectChange('createAddressRequest.country_uuid', value)}
                            renderInput={
                              params => (
                                <TextField
                                  required
                                  {...params}
                                  label="Country"
                                  fullWidth
                                  error={!!(formik.touched.createAddressRequest?.country_uuid && formik.errors.createAddressRequest?.country_uuid)}
                                  helperText={formik.touched.createAddressRequest?.country_uuid && formik.errors.createAddressRequest?.country_uuid ? formik.errors.createAddressRequest?.country_uuid : ""}
                                />
                              )
                            }
                          ></Autocomplete>

                          <TextField
                            fullWidth
                            required
                            label="City"
                            name="city"
                            value={formik.values.createAddressRequest.city}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.city')}
                            error={!!(formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city)}
                            helperText={formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city ? formik.errors.createAddressRequest?.city : ""}
                          />

                          <TextField
                            fullWidth
                            label="Line 2"
                            name="line_2"
                            value={formik.values.createAddressRequest.line_2}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_2')}
                            error={!!(formik.touched.createAddressRequest?.line_2 && formik.errors.createAddressRequest?.line_2)}
                            helperText={formik.touched.createAddressRequest?.line_2 && formik.errors.createAddressRequest?.line_2 ? formik.errors.createAddressRequest?.line_2 : ""}
                          />

                          <TextField
                            fullWidth
                            required
                            label="Postcode"
                            type='postcode'
                            value={formik.values.createAddressRequest.postcode}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.postcode')}
                            error={!!(formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode)}
                            helperText={formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode ? formik.errors.createAddressRequest?.postcode : ""}
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
                      {!companyId && <>
                        <Grid
                          xs={12}
                          md={6}
                          lg={6}
                        >
                          <Stack spacing={3}>
                            <TextField
                              fullWidth
                              required
                              label="First Name"
                              name="first_name"
                              value={formik.values.createUserRequest.first_name}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange('createUserRequest.first_name')}
                              error={!!(formik.touched.createUserRequest.first_name && formik.errors.createUserRequest?.first_name)}
                              helperText={formik.touched.createUserRequest.first_name && formik.errors.createUserRequest?.first_name ? formik.errors.createUserRequest?.first_name : ""}
                            />

                            <TextField
                              fullWidth
                              required
                              label="Username"
                              name="username"
                              value={formik.values.createUserRequest.username}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange('createUserRequest.username')}
                              error={!!(formik.touched.createUserRequest.username && formik.errors.createUserRequest?.username)}
                              helperText={formik.touched.createUserRequest.username && formik.errors.createUserRequest?.username ? formik.errors.createUserRequest?.username : ""}
                            />

                            <TextField
                              fullWidth
                              required
                              label="Password"
                              name="password"
                              type='password'
                              value={formik.values.createUserRequest.password}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange('createUserRequest.password')}
                              error={!!(formik.touched.createUserRequest.password && formik.errors.createUserRequest?.password)}
                              helperText={formik.touched.createUserRequest.password && formik.errors.createUserRequest?.password ? formik.errors.createUserRequest?.password : ""}
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
                              label="Last Name"
                              type='last_name'
                              value={formik.values.createUserRequest.last_name}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange('createUserRequest.last_name')}
                              error={!!(formik.touched.createUserRequest.last_name && formik.errors.createUserRequest?.last_name)}
                              helperText={formik.touched.createUserRequest.last_name && formik.errors.createUserRequest?.last_name ? formik.errors.createUserRequest?.last_name : ""}
                            />

                            <TextField
                              fullWidth
                              required
                              label="Email"
                              name="email"
                              type='email'
                              value={formik.values.createUserRequest.email}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange('createUserRequest.email')}
                              error={!!(formik.touched.createUserRequest.email && formik.errors.createUserRequest?.email)}
                              helperText={formik.touched.createUserRequest.email && formik.errors.createUserRequest?.email ? formik.errors.createUserRequest?.email : ""}
                            />

                            <TextField
                              fullWidth
                              required
                              label="Confirm Password"
                              name="password_confirmation"
                              type='password'
                              value={formik.values.createUserRequest.password_confirmation}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange('createUserRequest.password_confirmation')}
                              error={!!(formik.touched.createUserRequest.password_confirmation && formik.errors.createUserRequest?.password_confirmation)}
                              helperText={formik.touched.createUserRequest.password_confirmation && formik.errors.createUserRequest?.password_confirmation ? formik.errors.createUserRequest?.password_confirmation : ""}
                            />

                          </Stack>
                        </Grid>
                      </>
                      }
                    </Grid>

                  </Card>

                </Grid>

                <Grid
                  xs={12}
                  md={12}
                  lg={12}
                >
                  <Card style={{ width: "100%" }}
                    sx={{
                      px: 3,
                    }}>
                    <CardActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
                      <label htmlFor="image-upload-input">
                        <Button variant="contained" component="span">
                          Upload Images
                        </Button>
                      </label>
                    </CardActions>
                    <CardContent>
                      <Stack spacing={3}>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            multiple
                            onChange={handleFilesChange}
                            id="image-upload-input"
                          />
                          <Grid container spacing={3}>
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
                      </Stack>
                    </CardContent>
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
