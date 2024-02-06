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

const Page = () => {

  const { pageParams, user } = useAuthContext();
  const companyService = new CompanyService();
  const miscService = new MiscService();

  const router = useRouter();

  const companyId = router.query.id;
  const [company, setCompany] = useState(
    {
      uuid: null,
      name: "",
      description: "",
      logo: null,
      total_rating: 0,
      address: {
        uuid: null,
        line_1: "",
        line_2: "",
        line_3: "",
        city: "",
        region: "",
        postcode: "",
        country: {
          name: "",
        }
      },
      gallery: [
      ],
      ratings: [
      ]
    });

  const [countries, setCountries] = useState([]);

  const [logo, setLogo] = useState(null);

  useEffect(() => {

    miscService.lists().then((response) => {
      setCountries(response.data?.data?.countries);

      companyService.getCompany(companyId).then((response) => {
        setCompany({ ...response.data.data, logo: null });
        setLogo({ uri: response.data?.data?.logo });
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

  const handleChange = useCallback(
    (event) => {
      setCompany((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleInputChange = (field, value) => {
    if (field.startsWith('details.') || field.startsWith('address.')) {
      // Handle nested objects
      const [parentField, nestedField] = field.split('.');
      setCompany({
        ...company,
        [parentField]: {
          ...company[parentField],
          [nestedField]: value,
        },
      });
    } else {
      setCompany({ ...company, [field]: value });
    }
  };

  const handleSelectChange = (field, fieldObject, value) => {
    console.log(value)
    if (field.startsWith('details.') || field.startsWith('address.')) {
      // Handle nested objects
      const [parentFieldObject, nestedFieldObject] = fieldObject.split('.');
      const [parentField, nestedField] = field.split('.');
      setCompany({
        ...company,
        [parentField]: {
          ...company[parentFieldObject],
          ...company[parentField],
          [nestedFieldObject]: value,
          [nestedField]: value ? value[nestedField] : null,
        },
      });
    } else {
      setCompany({ ...company, [field]: value });
    }
  }

  const submitForm = () => {
    console.log(company);

    companyService.update(company).then((response) => {

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
                      label="Name"
                      value={company.name}
                      onChange={(event) => handleInputChange('name', event.target.value)}
                    />

                    <Autocomplete
                      options={countries}
                      value={company?.address?.country}
                      getOptionLabel={option => option['name'] ?? ''}
                      onChange={(event, value) => handleSelectChange('address.country_uuid', 'address.country', value)}
                      renderInput={
                        params => (
                          <TextField
                            {...params}
                            label="Country"
                            fullWidth
                          />
                        )
                      }
                    ></Autocomplete>

                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={company?.address?.city}
                      onChange={(event) => handleInputChange('address.city', event.target.value)}
                    />

                    <TextField
                      fullWidth
                      label="Line 2"
                      name="line_2"
                      value={company?.address?.line_2}
                      onChange={(event) => handleInputChange('address.line_2', event.target.value)}
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
                      label="Total Rating"
                      type='number'
                      disabled
                      value={company.total_rating ?? '-'}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      label="Region"
                      name="region"
                      value={company?.address?.region}
                      onChange={(event) => handleInputChange('address.region', event.target.value)}
                    />

                    <TextField
                      fullWidth
                      label="Line 1"
                      name="line_1"
                      value={company?.address?.line_1}
                      onChange={(event) => handleInputChange('address.line_1', event.target.value)}
                    />

                    <TextField
                      fullWidth
                      label="Line 3"
                      name="line_3"
                      value={company?.address?.line_3}
                      onChange={(event) => handleInputChange('address.line_3', event.target.value)}
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
                    value={company.description}
                    onChange={(event) => handleInputChange('description', event.target.value)}
                  />
                </Grid>
                <Button
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <CheckCircleIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  onClick={submitForm}
                >
                  Save
                </Button>
              </Grid>
            </Card>
          </Stack>
        </Container>
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
