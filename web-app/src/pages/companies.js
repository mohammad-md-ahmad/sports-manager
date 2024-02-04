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
  Card
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CompanyCard } from 'src/sections/companies/company-card';
import { CompaniesSearch } from 'src/sections/companies/companies-search';
import { useEffect, useReducer, useState } from 'react';
import CompanyService from 'api/CompanyService';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';

const Page = () => {
  const companyService = new CompanyService();
  const [companies, setCompanies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setCompanies([
      {
        "uuid": "a51efa5c-f708-45db-8d06-926292b58b55",
        "name": "Company Three",
        "description": "the company one account",
        "logo": "https://liber.quad-bh.com/files/images?path=company-logos/sFDbQy6q9edeSBZtAyVN.jpg",
        "total_rating": null,
        "address": {
          "uuid": "e5c97a4b-8a83-48af-a52d-3d16cc1bf8e1",
          "model_type": "App\\Models\\Company",
          "model_id": "1",
          "line_1": "Azmi St.",
          "line_2": null,
          "line_3": null,
          "city": "Tripoli",
          "region": "North Lebanon",
          "postcode": "1111",
          "geocode_data": {
            "lat": "34.23",
            "lng": "35.3456"
          },
          "country_uuid": "5cba9781-f7bb-4e18-b340-8b25e558dfca",
          "country": {
            "id": 1,
            "uuid": "5cba9781-f7bb-4e18-b340-8b25e558dfca",
            "name": "Lebanon",
            "iso_short_code": "LB",
            "flag": null,
            "allowed_to_operate": 1,
            "distance_metric": "KILOMETRES",
            "currency_id": 1,
            "created_at": "2023-10-15T06:29:52.000000Z",
            "updated_at": "2023-12-29T19:08:41.000000Z",
            "deleted_at": null
          }
        },
        "gallery": [],
        "ratings": []
      },
      {
        "uuid": "b8f001fb-7380-428e-916b-6a690d3bf871",
        "name": "Liber Co",
        "description": "Descriptions of the company liber Co",
        "logo": "https://liber.quad-bh.com/files/images?path=company-logos/U0vEg1bnvEpyuvWrm1ya.jpg",
        "total_rating": null,
        "address": null,
        "gallery": [],
        "ratings": []
      },
      {
        "uuid": "e7cb5895-c13a-40b4-9f41-b0fca9e0ffc1",
        "name": "LiberCo",
        "description": "Liber co for football",
        "logo": "https://liber.quad-bh.com/files/images?path=company-logos/psbnqBVk1jb6WW0yQjjR.jpg",
        "total_rating": 4,
        "address": {
          "uuid": "e4da0876-2fcd-4b44-98c3-d1ce716275f8",
          "model_type": "App\\Models\\Company",
          "model_id": "3",
          "line_1": "l1",
          "line_2": null,
          "line_3": null,
          "city": "tripoli",
          "region": null,
          "postcode": null,
          "geocode_data": null,
          "country_uuid": "5cba9781-f7bb-4e18-b340-8b25e558dfca",
          "country": {
            "id": 1,
            "uuid": "5cba9781-f7bb-4e18-b340-8b25e558dfca",
            "name": "Lebanon",
            "iso_short_code": "LB",
            "flag": null,
            "allowed_to_operate": 1,
            "distance_metric": "KILOMETRES",
            "currency_id": 1,
            "created_at": "2023-10-15T06:29:52.000000Z",
            "updated_at": "2023-12-29T19:08:41.000000Z",
            "deleted_at": null
          }
        },
        "gallery": [
          {
            "uuid": "b2988f11-28b3-4b8d-ab7f-1a30ed4121e2",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/XPnC0YghFI9fgdXrUSkv.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "6d7656a8-84ec-4542-b268-f8e5f73fa90b",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/mb8sDQ9LbO35E4xy6E63.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "d85da53a-1054-4de0-8f4b-148af16514c6",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/m72uY4YUnFx174L4jG9i.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "57b01a19-024f-4881-89b6-d53eacce7ec8",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/KfGKUivdMN7jlGhkvaMk.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "d7590c02-27ae-4523-b017-a590a0844264",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/8FS1cjs4ypzaFQNL4euC.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "59d3c2e2-d9e5-4bdf-83ff-33ccdcf1a2d5",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/9nL5WtraXwI8MJqsYOHY.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "69624769-b0fd-4d56-823d-984650949bc2",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/GN7OhL7Ct1iaGtZWA7PR.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "3b1bbef3-fb4c-4b19-bbd4-ca8bd97e04ff",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/JS8bxhASiNqa7TUqresv.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "35c2c465-6569-41bf-baac-3fde0eb07b40",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/vZVpGkRwcf0b62yQXm2j.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "725ac0fd-b3af-4652-95ed-5394ebf8629d",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/53uzKNcbeC6MrPAjsvPX.jpg",
            "is_primary": 0,
          },
          {
            "uuid": "40beecec-2dbd-4330-b84e-810ae0370dd4",
            "image": "https://liber.quad-bh.com/files/images?path=galleries/P4FrcOicBWMoLDSkDAsC.jpg",
            "is_primary": 0,
          }
        ],
        "ratings": [
          {
            "uuid": "59dc836b-d5d2-4597-8547-96b62d6f732b",
            "rated_entity_id": 3,
            "user_id": 14,
            "booking_id": null,
            "commenter_name": "Abdulrahman Ahmad",
            "rating": "4",
            "comment": "I like it.",
            "deleted_at": null
          },
          {
            "uuid": "acca7b31-afe9-42e6-934a-695a91d35b8c",
            "rated_entity_id": 3,
            "user_id": 11,
            "booking_id": null,
            "commenter_name": "jimmy mcgill",
            "rating": "3",
            "comment": "The playground need maintetance.",
            "deleted_at": null
          },
          {
            "uuid": "68e81db8-5ddd-4d3d-a48a-107df2e9e311",
            "rated_entity_id": 3,
            "user_id": 12,
            "booking_id": null,
            "commenter_name": "user user",
            "rating": "5",
            "comment": "Everything is perfect. Great playground!",
            "deleted_at": null
          }
        ]
      },
      {
        "uuid": "555ebcf0-2f31-47c1-a95e-95bf5025428c",
        "name": "HMM",
        "description": null,
        "logo": "https://liber.quad-bh.com/files/images?path=company-logos/CHPPumEbPeg0rZ4KoQIO.jpg",
        "total_rating": null,
        "address": null,
        "gallery": [],
        "ratings": []
      },
      {
        "uuid": "50546824-a2d5-40b9-90a1-6a2d88a57fb3",
        "name": "Wajihhhhh",
        "description": null,
        "logo": null,
        "total_rating": null,
        "address": null,
        "gallery": [],
        "ratings": []
      }
    ]);
    // companyService.list().then((response) => {
    //   console.log("companyService", response?.data?.data);
    //   setCompanies(response?.data?.data)
    // }).catch((error) => {
    //   // Handle API request errors here
    //   console.error(error);
    //   //throw new Error('Please check your email and password');
    //   throw new Error(error.message);
    // });

  }, [])

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 250
    },
    {
      field: 'total_rating',
      headerName: 'Total Rating',
      width: 150,
    },
    {
      field: 'address',
      headerName: 'Address',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 250,
      valueGetter: (params) =>
        `${params.row.address ?
          (params.row.address.country.name) +
          (params.row.address.region ? ', ' + params.row.address.region : '') +
          (params.row.address.city ? ', ' + params.row.address.city : '')
          : ''}`,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1
    },
    //  {
    //   field: 'description',
    //   headerName: 'Description',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) =>
    //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    // },
  ];

  const handleRowClick = (params) => {
    // Handle the row click event
    console.log('Row clicked:', params.row);
    // You can perform actions based on the clicked row, such as navigating to a detail page

    router.push('/company?id=' + params.row.uuid);
  };

  return (
    <>
      <Head>
        <title>
          Companies | Liber
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
                  Companies
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
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CompaniesSearch />
            <Grid
              container
              spacing={3}
            >
              <Card style={{ width: "100%" }}>
                <DataGrid
                  getRowId={(row) => row.uuid}
                  rows={companies}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  disableRowSelectionOnClick
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                  onRowClick={(row) => {
                    handleRowClick(row);
                  }}
                />
              </Card>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
