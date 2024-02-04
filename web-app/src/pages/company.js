import Head from 'next/head';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
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
  TextField
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CompanyCard } from 'src/sections/companies/company-card';
import { CompaniesSearch } from 'src/sections/companies/companies-search';
import { useCallback, useEffect, useState } from 'react';
import CompanyService from 'api/CompanyService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAuthContext } from 'src/contexts/auth-context';
import { useRouter } from 'next/router';

const Page = () => {


  const { pageParams, user } = useAuthContext();
  const companyService = new CompanyService();
  const router = useRouter();

  const companyId = router.query.id;
  const [company, setCompany] = useState(
    {
      uuid: "",
      name: "",
      description: "",
      logo: "",
      total_rating: 0,
      address: {
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

  useEffect(() => {
    companyService.getCompany(companyId).then((response) => {
      setCompany(response?.data?.data);
    }).catch((error) => {
      // Handle API request errors here
      console.error(error);
      //throw new Error('Please check your email and password');
      throw new Error(error.message);
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
                      name="name"
                      disabled
                      value={company.name}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      label="Country"
                      name="country"
                      disabled
                      value={company?.address?.country?.name}
                      onChange={handleChange}
                    />
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      disabled
                      value={company?.address?.city}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      label="Line 2"
                      name="line_2"
                      disabled
                      value={company?.address?.line_2}
                      onChange={handleChange}
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
                      disabled
                      value={company?.address?.region}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      label="Line 1"
                      name="line_1"
                      disabled
                      value={company?.address?.line_1}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      label="Line 3"
                      name="line_3"
                      disabled
                      value={company?.address?.line_3}
                      onChange={handleChange}
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
                    disabled
                    value={company.description}
                    onChange={handleChange}
                  />
                </Grid>
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
