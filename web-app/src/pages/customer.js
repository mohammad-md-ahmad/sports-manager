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
import CustomerService from 'api/CustomerService';

import { useRouter } from 'next/router';
import MiscService from 'api/MiscService';
import { string, array, object as yupObject } from "yup";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { UserType } from 'helpers/constants';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { AccountProfile } from 'src/sections/account/account-profile';
import { imageUrlToBase64 } from 'helpers/functions';

const Page = () => {
  const customerService = new CustomerService();
  const miscService = new MiscService();
  const router = useRouter();

  const customerId = router?.query?.id ?? null;

  const initialFormDataValues = {

    first_name: "",
    last_name: "",
    username: "",
    email: "",
    dob: null,
    gender: "",
    password: "",
    password_confirmation: "",
    type: UserType.CustomerUser,

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

  const passwordValidation = customerId ?
    string() :
    string().min(8, 'Password must be at least 8 characters')
      .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol')
      .required('Password is required');

  const passwordConfirmationValidation = customerId ?
    string() :
    string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Password confirmation is required')


  const formDataValidateSchema = yupObject().shape({
    first_name: string().required('First name is required'),
    last_name: string().required('Last name is required'),
    username: string().required('Username is required'),
    email: string().required('Email is required'),

    createAddressRequest: yupObject().shape({
      line_1: string().required('Line 1 is required'),
      city: string().required('City is required'),
      region: string().required('Region is required'),
      postcode: string().required('Postcode is required'),
      country_uuid: string().required('Country is required'),
    }),

    password: passwordValidation,
    password_confirmation: passwordConfirmationValidation,

  });

  const initialTouched = {
    first_name: false,
    last_name: false,
    username: false,
    email: false,
    dob: false,
    gender: false,
    password: false,
    password_confirmation: false,

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

  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState({});

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    miscService.lists().then((response) => {
      setCountries(response.data?.data?.countries);

      const outputArray = Object.entries(response.data?.data?.user_genders).map(([id, label]) => ({ id, label }));
      setGenders(outputArray);

      if (customerId) {
        customerService.getCustomer(customerId).then(async (response) => {
          setLogo({ uri: response.data?.data?.logo });

          let customerData = { ...response.data.data };
          customerData['createAddressRequest'] = customerData['address'];

          delete customerData['address'];
          setSelectCountry(customerData?.createAddressRequest?.country);

          setSelectedGender({ id: customerData?.gender, label: customerData?.gender });

          if (customerData['dob']) {
            let date = new Date(`${customerData['dob']}`);
            customerData['dob'] = date;
          }

          if (customerData.profile_picture) {
            customerData.profile_picture = await imageUrlToBase64(customerData.profile_picture);
          }

          formik.setValues(customerData);

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

  const handleSelectChange = (field, value) => {
    setSelectCountry(value);
    formik.setFieldValue(field, value ? value['country_uuid'] : null);
  }

  const handleGenderSelectChange = (field, value) => {
    setSelectedGender(value);
    formik.setFieldValue(field, value ? value['id'] : null);
  }

  const submitForm = (values) => {
    let data = { ...values }
    data['type'] = UserType.CustomerUser;

    if (data['dob'])
      data['dob'] = format(data['dob'], 'yyyy-MM-dd HH:mm:ss')

    if (customerId) {
      data['address'] = data['createAddressRequest'];
      delete data['createAddressRequest'];

      customerService.update(data).then((response) => {

      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    } else {
      customerService.create(data).then((response) => {
        router.push('/customers');
      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    }

  }

  const handleDateChange = (date) => {
    formik.setFieldValue('dob', date);
  };

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
        formik.setFieldValue('profile_picture', reader.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <Head>
        <title>
          Customer | Liber
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
                    Customer
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
                          src={formik.values.profile_picture}
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
                            label="First Name"
                            name="first_name"
                            value={formik.values.first_name}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('first_name')}
                            error={!!(formik.touched.first_name && formik.errors.first_name)}
                            helperText={formik.touched.first_name && formik.errors.first_name ? formik.errors.first_name : ""}
                          />

                          <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formik.values.username}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('username')}
                            error={!!(formik.touched.username && formik.errors.username)}
                            helperText={formik.touched.username && formik.errors.username ? formik.errors.username : ""}
                          />

                          <DatePicker
                            fullWidth
                            label="Date of birth"
                            name="dob"
                            value={formik.values.dob}
                            onBlur={formik.handleBlur}
                            onChange={handleDateChange}
                            error={!!(formik.touched.dob && formik.errors.dob)}
                            helperText={formik.touched.dob && formik.errors.dob ? formik.errors.dob : ""}
                            renderInput={(params) => <TextField {...params} />}
                          />

                          <Autocomplete
                            options={countries}
                            value={selectCountry}
                            getOptionLabel={option => option['name'] ?? ''}
                            onChange={(event, value) => handleSelectChange('createAddressRequest.country_uuid', value)}
                            renderInput={
                              params => (
                                <TextField
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
                            label="City"
                            name="city"
                            value={formik.values.createAddressRequest?.city}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.city')}
                            error={!!(formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city)}
                            helperText={formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city ? formik.errors.createAddressRequest?.city : ""}
                          />

                          <TextField
                            fullWidth
                            label="Line 2"
                            name="line_2"
                            value={formik.values.createAddressRequest?.line_2}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_2')}
                            error={!!(formik.touched.createAddressRequest?.line_2 && formik.errors.createAddressRequest?.line_2)}
                            helperText={formik.touched.createAddressRequest?.line_2 && formik.errors.createAddressRequest?.line_2 ? formik.errors.createAddressRequest?.line_2 : ""}
                          />

                          <TextField
                            fullWidth
                            label="Postcode"
                            type='postcode'
                            value={formik.values.createAddressRequest?.postcode}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.postcode')}
                            error={!!(formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode)}
                            helperText={formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode ? formik.errors.createAddressRequest?.postcode : ""}
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
                            label="Last Name"
                            type='last_name'
                            value={formik.values.last_name}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('last_name')}
                            error={!!(formik.touched.last_name && formik.errors.last_name)}
                            helperText={formik.touched.last_name && formik.errors.last_name ? formik.errors.last_name : ""}
                          />

                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type='email'
                            value={formik.values.email}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('email')}
                            error={!!(formik.touched.email && formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
                          />

                          <Autocomplete
                            options={genders}
                            value={selectedGender}
                            getOptionLabel={option => option['label'] ?? ''}
                            onChange={(event, value) => handleGenderSelectChange('gender', value)}
                            renderInput={
                              params => (
                                <TextField
                                  {...params}
                                  label="Gender"
                                  fullWidth
                                  error={!!(formik.touched.gender && formik.errors.gender)}
                                  helperText={formik.touched.gender && formik.errors.gender ? formik.errors.gender : ""}
                                />
                              )
                            }
                          />

                          <TextField
                            fullWidth
                            label="Region"
                            name="region"
                            value={formik.values.createAddressRequest?.region}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.region')}
                            error={!!(formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region)}
                            helperText={formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region ? formik.errors.createAddressRequest?.region : ""}
                          />

                          <TextField
                            fullWidth
                            label="Line 1"
                            name="line_1"
                            value={formik.values.createAddressRequest?.line_1}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_1')}
                            error={!!(formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1)}
                            helperText={formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1 ? formik.errors.createAddressRequest?.line_1 : ""}
                          />

                          <TextField
                            fullWidth
                            label="Line 3"
                            name="line_3"
                            value={formik.values.createAddressRequest?.line_3}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange('createAddressRequest.line_3')}
                            error={!!(formik.touched.createAddressRequest?.line_3 && formik.errors.createAddressRequest?.line_3)}
                            helperText={formik.touched.createAddressRequest?.line_3 && formik.errors.createAddressRequest?.line_3 ? formik.errors.createAddressRequest?.line_3 : ""}
                          />

                        </Stack>

                      </Grid>
                      <Grid
                        xs={12}
                        md={12}
                        lg={12}
                      >

                      </Grid>
                      {!customerId && <>
                        <Grid
                          xs={12}
                          md={6}
                          lg={6}
                        >
                          <Stack spacing={3}>


                            <TextField
                              fullWidth
                              label="Password"
                              name="password"
                              type='password'
                              value={formik.values.password}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange('password')}
                              error={!!(formik.touched.password && formik.errors.password)}
                              helperText={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
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
                              label="Confirm Password"
                              name="password_confirmation"
                              type='password'
                              value={formik.values.password_confirmation}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange('password_confirmation')}
                              error={!!(formik.touched.password_confirmation && formik.errors.password_confirmation)}
                              helperText={formik.touched.password_confirmation && formik.errors.password_confirmation ? formik.errors.password_confirmation : ""}
                            />

                          </Stack>
                        </Grid>
                      </>
                      }
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
