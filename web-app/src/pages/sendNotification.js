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
  CardActions
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import CompanyService from 'api/CompanyService';
import MiscService from 'api/MiscService';
import { string, array, object as yupObject } from "yup";
import { useFormik } from 'formik';

const Page = () => {

  const companyService = new CompanyService();
  const miscService = new MiscService();

  const initialFormDataValues = {
    country_uuid: "",
    user_type: "",
    company_uuid: "",
    message: ""
  }

  const formDataValidateSchema = yupObject().shape({
    message: string().required('Message is required'),
  });

  const initialTouched = {
    country_uuid: false,
    user_type: false,
    company_uuid: false,
    message: false,
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
  const [userTypes, setUserTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedObject, setSelectedObject] = useState({
    country_uuid: {},
    user_type: {},
    company_uuid: {}
  });

  useEffect(() => {
    miscService.lists().then((response) => {
      setCountries(response.data?.data?.countries);

      const outputArray = Object.entries(response.data?.data?.user_types).map(([id, label]) => ({ id, label }));
      setUserTypes(outputArray);

      companyService.list().then((response) => {
        setCompanies(response.data?.data?.data);

      }).catch((error) => {
        // Handle API request errors here
        console.error(error);
        //throw new Error('Please check your email and password');
        throw new Error(error.message);
      });
    }).catch((error) => {
      console.error(error);
    });

  }, [])

  const handleSelectChange = (field, value) => {
    setSelectedObject({ ...selectedObject, [field]: value })

    formik.setFieldValue(field, value ? value['country_uuid'] : null);
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
          Send Notification | Liber
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
                    Send Notification
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
                      <Autocomplete
                        options={companies}
                        value={selectedObject['company_uuid']}
                        getOptionLabel={option => option['name'] ?? ''}
                        onChange={(event, value) => handleSelectChange('company_uuid', value)}
                        renderInput={
                          params => (
                            <TextField
                              {...params}
                              label="Companies"
                              fullWidth
                              error={!!(formik.touched.company_uuid && formik.errors.company_uuid)}
                              helperText={formik.touched.company_uuid && formik.errors.company_uuid ? formik.errors.company_uuid : ""}
                            />
                          )
                        }
                      />

                      <Autocomplete
                        options={userTypes}
                        value={selectedObject['user_type']}
                        getOptionLabel={option => option['label'] ?? ''}
                        onChange={(event, value) => handleSelectChange('user_type', value)}
                        renderInput={
                          params => (
                            <TextField
                              {...params}
                              label="User Type"
                              fullWidth
                              error={!!(formik.touched.user_type && formik.errors.user_type)}
                              helperText={formik.touched.user_type && formik.errors.user_type ? formik.errors.user_type : ""}
                            />
                          )
                        }
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
                        value={selectedObject['country_uuid']}
                        getOptionLabel={option => option['name'] ?? ''}
                        onChange={(event, value) => handleSelectChange('country_uuid', value)}
                        renderInput={
                          params => (
                            <TextField
                              {...params}
                              label="Country"
                              fullWidth
                              error={!!(formik.touched.country_uuid && formik.errors.country_uuid)}
                              helperText={formik.touched.country_uuid && formik.errors.country_uuid ? formik.errors.country_uuid : ""}
                            />
                          )
                        }
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
                      label="Message"
                      name="message"
                      multiline
                      rows={4}
                      value={formik.values.description}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange('message')}
                      error={!!(formik.touched.message && formik.errors.message)}
                      helperText={formik.touched.message && formik.errors.message ? formik.errors.message : ""}
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
                    Send
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
