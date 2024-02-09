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
import React, { useEffect, useReducer, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';

import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteConfirmationDialog from 'src/components/deleteConfirmationDialog';
import AppListService from 'api/AppListService';

const Page = () => {
  const appListService = new AppListService();
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [idToBeDeleted, setIdToBeDeleted] = useState();

  const handleDeleteClick = (id) => () => {
    setDeleteDialogOpen(true);
    setIdToBeDeleted(id);
  };

  const handleDeleteConfirm = () => {

    let tempPaymentMethods = [...paymentMethods];
    tempPaymentMethods.splice(idToBeDeleted, 1);
    setPaymentMethods(tempPaymentMethods);

    //TODO submit the new payment methods

    setDeleteDialogOpen(false);
    setIdToBeDeleted(null);

    // adService.deleteAd({ uuid: idToBeDeleted }).then((response) => {
    //   loadData();
    // }).catch((error) => {
    //   // Handle API request errors here
    //   console.error(error);
    //   //throw new Error('Please check your email and password');
    //   throw new Error(error.message);
    // }).finally(() => {
    //   setDeleteDialogOpen(false);
    //   setIdToBeDeleted(null);
    // });
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [])

  const loadData = () => {
    appListService.list().then((response) => {
      if (response?.data?.data?.data) {
        const filteredArray = response?.data?.data?.data.find(obj => obj.key === 'Payment_methods');
        const arrayOfObjects = filteredArray.value.map((name, index) => ({ id: index, name }));
        setPaymentMethods(arrayOfObjects);
      }

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
      flex: 1,
      editable: true
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

  const addPaymentMehod = () => {
    const newRow = { id: paymentMethods.length, name: '' };
    setPaymentMethods([...paymentMethods, newRow]);
  }

  const mySaveOnServerFunction = React.useCallback((updatedRow, originalRow) => {
    let tempPaymentMethods = [...paymentMethods];
    tempPaymentMethods[updatedRow.id] = updatedRow;
    setPaymentMethods(tempPaymentMethods);

    //TODO submit the new payment methods

    return tempPaymentMethods[updatedRow.id];
  });

  const handleProcessRowUpdateError = React.useCallback((error) => {
  }, []);

  return (
    <>
      <Head>
        <title>
          Payment Methods | Liber
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
                  Payment Methods
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
                  onClick={addPaymentMehod}
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
                  getRowId={(row) => row.id}
                  rows={paymentMethods}
                  columns={columns}
                  processRowUpdate={(newRow, oldRow) => mySaveOnServerFunction(newRow, oldRow)}
                  //onEditRowModelChange={mySaveOnServerFunction}

                  onProcessRowUpdateError={handleProcessRowUpdateError}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  editMode="row"
                  pageSizeOptions={[5, 10]}
                  disableRowSelectionOnClick
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                    },
                  }}
                // onRowClick={(row) => {
                //   handleRowClick(row);
                // }}

                />
                < DeleteConfirmationDialog
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
