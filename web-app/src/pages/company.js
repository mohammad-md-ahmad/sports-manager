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
  Autocomplete
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
  const [logo, setLogo] = useState(null);

  useEffect(() => {
    miscService.lists().then((response) => {
      setCountries(response.data?.data?.countries);

      if (companyId) {
        companyService.getCompany(companyId).then((response) => {
          setLogo({ uri: response.data?.data?.logo });

          let companyData = { ...response.data.data, logo: null };
          companyData['createAddressRequest'] = companyData['address'];

          delete companyData['address'];
          setSelectCountry(companyData?.createAddressRequest?.country);

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

  const handleSelectChange = (field, value) => {
    setSelectCountry(value);
    formik.setFieldValue(field, value['country_uuid']);
  }

  const submitForm = (values) => {
    let data = { ...values }
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

      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    }

  }

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
                        label="Company Name"
                        name="name"
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        error={!!(formik.touched.name && formik.errors.name)}
                      />
                      {formik.touched.name && formik.errors.name &&
                        <Typography
                          color="error"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {formik.errors.name}
                        </Typography>
                      }

                      <TextField
                        fullWidth
                        label="Region"
                        name="region"
                        value={formik.values.createAddressRequest.region}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('createAddressRequest.region')}
                        error={!!(formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region)}
                      />
                      {formik.touched.createAddressRequest?.region && formik.errors.createAddressRequest?.region &&
                        <Typography
                          color="error"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {formik.errors.createAddressRequest?.region}
                        </Typography>
                      }

                      <TextField
                        fullWidth
                        label="Line 1"
                        name="line_1"
                        value={formik.values.createAddressRequest.line_1}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('createAddressRequest.line_1')}
                        error={!!(formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1)}
                      />
                      {formik.touched.createAddressRequest?.line_1 && formik.errors.createAddressRequest?.line_1 &&
                        <Typography
                          color="error"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {formik.errors.createAddressRequest?.line_1}
                        </Typography>
                      }

                      <TextField
                        fullWidth
                        label="Line 3"
                        name="line_3"
                        value={formik.values.createAddressRequest.line_3}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('createAddressRequest.line_3')}
                        error={!!(formik.touched.createAddressRequest?.line_3 && formik.errors.createAddressRequest?.line_3)}
                      />
                      {formik.touched.createAddressRequest?.line_3 && formik.errors.createAddressRequest?.line_3 &&
                        <Typography
                          color="error"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {formik.errors.createAddressRequest?.line_3}
                        </Typography>
                      }

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
                              {...params}
                              label="Country"
                              fullWidth
                              error={!!(formik.touched.createAddressRequest?.country_uuid && formik.errors.createAddressRequest?.country_uuid)}
                            />
                          )
                        }
                      ></Autocomplete>
                      {formik.touched.createAddressRequest?.country_uuid && formik.errors.createAddressRequest?.country_uuid &&
                        <Typography
                          color="error"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {formik.errors.createAddressRequest?.country_uuid}
                        </Typography>
                      }

                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={formik.values.createAddressRequest.city}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('createAddressRequest.city')}
                        error={!!(formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city)}
                      />
                      {formik.touched.createAddressRequest?.city && formik.errors.createAddressRequest?.city &&
                        <Typography
                          color="error"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {formik.errors.createAddressRequest?.city}
                        </Typography>
                      }

                      <TextField
                        fullWidth
                        label="Line 2"
                        name="line_2"
                        value={formik.values.createAddressRequest.line_2}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('createAddressRequest.line_2')}
                        error={!!(formik.touched.createAddressRequest?.line_2 && formik.errors.createAddressRequest?.line_2)}
                      />
                      {formik.touched.createAddressRequest?.line_2 && formik.errors.createAddressRequest?.line_2 &&
                        <Typography
                          color="error"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {formik.errors.createAddressRequest?.line_2}
                        </Typography>
                      }

                      <TextField
                        fullWidth
                        label="Postcode"
                        type='postcode'
                        value={formik.values.createAddressRequest.postcode}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange('createAddressRequest.postcode')}
                        error={!!(formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode)}
                      />
                      {formik.touched.createAddressRequest?.postcode && formik.errors.createAddressRequest?.postcode &&
                        <Typography
                          color="error"
                          sx={{ mt: 1 }}
                          variant="body2"
                        >
                          {formik.errors.createAddressRequest?.postcode}
                        </Typography>
                      }

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
                    />

                    {formik.touched.description && formik.errors.description &&
                      <Typography
                        color="error"
                        sx={{ mt: 1 }}
                        variant="body2"
                      >
                        {formik.errors.description}
                      </Typography>
                    }

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
                          label="First Name"
                          name="first_name"
                          value={formik.values.createUserRequest.first_name}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange('createUserRequest.first_name')}
                          error={!!(formik.touched.createUserRequest.first_name && formik.errors.createUserRequest?.first_name)}
                        />
                        {formik.touched.createUserRequest.first_name && formik.errors.createUserRequest?.first_name &&
                          <Typography
                            color="error"
                            sx={{ mt: 1 }}
                            variant="body2"
                          >
                            {formik.errors.createUserRequest?.first_name}
                          </Typography>
                        }

                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={formik.values.createUserRequest.username}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange('createUserRequest.username')}
                          error={!!(formik.touched.createUserRequest.username && formik.errors.createUserRequest?.username)}
                        />
                        {formik.touched.createUserRequest.username && formik.errors.createUserRequest?.username &&
                          <Typography
                            color="error"
                            sx={{ mt: 1 }}
                            variant="body2"
                          >
                            {formik.errors.createUserRequest?.username}
                          </Typography>
                        }

                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type='password'
                          value={formik.values.createUserRequest.password}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange('createUserRequest.password')}
                          error={!!(formik.touched.createUserRequest.password && formik.errors.createUserRequest?.password)}
                        />
                        {formik.touched.createUserRequest.password && formik.errors.createUserRequest?.password &&
                          <Typography
                            color="error"
                            sx={{ mt: 1 }}
                            variant="body2"
                          >
                            {formik.errors.createUserRequest?.password}
                          </Typography>
                        }

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
                          value={formik.values.createUserRequest.last_name}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange('createUserRequest.last_name')}
                          error={!!(formik.touched.createUserRequest.last_name && formik.errors.createUserRequest?.last_name)}
                        />
                        {formik.touched.createUserRequest.last_name && formik.errors.createUserRequest?.last_name &&
                          <Typography
                            color="error"
                            sx={{ mt: 1 }}
                            variant="body2"
                          >
                            {formik.errors.createUserRequest?.last_name}
                          </Typography>
                        }

                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          type='email'
                          value={formik.values.createUserRequest.email}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange('createUserRequest.email')}
                          error={!!(formik.touched.createUserRequest.email && formik.errors.createUserRequest?.email)}
                        />
                        {formik.touched.createUserRequest.email && formik.errors.createUserRequest?.email &&
                          <Typography
                            color="error"
                            sx={{ mt: 1 }}
                            variant="body2"
                          >
                            {formik.errors.createUserRequest?.email}
                          </Typography>
                        }

                        <TextField
                          fullWidth
                          label="Confirm Password"
                          name="password_confirmation"
                          type='password'
                          value={formik.values.createUserRequest.password_confirmation}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange('createUserRequest.password_confirmation')}
                          error={!!(formik.touched.createUserRequest.password_confirmation && formik.errors.createUserRequest?.password_confirmation)}
                        />
                        {formik.touched.createUserRequest.password_confirmation && formik.errors.createUserRequest?.password_confirmation &&
                          <Typography
                            color="error"
                            sx={{ mt: 1 }}
                            variant="body2"
                          >
                            {formik.errors.createUserRequest?.password_confirmation}
                          </Typography>
                        }

                      </Stack>
                    </Grid>
                  </>
                  }
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
                </Grid>
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
