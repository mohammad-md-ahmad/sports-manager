import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
  Card
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';

import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteConfirmationDialog from 'src/components/deleteConfirmationDialog';
import SportService from 'api/SportService';

const Page = () => {
  const sportService = new SportService();
  const [sports, setSports] = useState([]);
  const router = useRouter();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState();

  const handleDeleteClick = (id) => () => {
    setDeleteDialogOpen(true);
    setIdToBeDeleted(id);
  };

  const handleDeleteConfirm = () => {
    sportService.deleteSport({ uuid: idToBeDeleted }).then((response) => {
      loadData();
    }).catch((error) => {
      // Handle API request errors here
      console.error(error);
      //throw new Error('Please check your email and password');
      throw new Error(error.message);
    }).finally(() => {
      setDeleteDialogOpen(false);
      setIdToBeDeleted(null);
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [])

  const loadData = () => {
    sportService.list().then((response) => {
      setSports(response?.data?.data?.data)
    }).catch((error) => {
      // Handle API request errors here
      console.error(error);
      //throw new Error('Please check your email and password');
      throw new Error(error.message);
    });
  }

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      width: 250
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
    },
    {
      field: 'is_enabled',
      headerName: 'Is Enabled',
      flex: 1,
      valueGetter: (params) =>
        `${params.row.is_enabled ? 'Enabled' : 'Disabled'}`,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      }
    }
  ];

  const handleRowClick = (params) => {
    // Handle the row click event
    console.log('Row clicked:', params.row);
    // You can perform actions based on the clicked row, such as navigating to a detail page

    router.push('/sport?id=' + params.row.uuid);
  };

  const addSport = () => {
    router.push('/sport');
  }

  return (
    <>
      <Head>
        <title>
          Sports | Liber
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
                  Sports
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
                  onClick={addSport}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <Grid
              container
              spacing={3}
            >
              <Card style={{ width: "100%" }}>
                <DataGrid
                  getRowId={(row) => row.uuid}
                  rows={sports}
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
                <DeleteConfirmationDialog
                  open={isDeleteDialogOpen}
                  onClose={handleDeleteCancel}
                  onConfirm={handleDeleteConfirm}
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
