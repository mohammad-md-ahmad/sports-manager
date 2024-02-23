import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
    Box,
    Button,
    Container,
    Stack,
    Typography,
    Unstable_Grid2 as Grid,
    Card,
    Avatar
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';

import SubscriptionPlanService from 'api/SubscriptionPlanService';

const Page = () => {
    const subscriptionPlanService = new SubscriptionPlanService();
    const [plans, setPlans] = useState([]);
    const router = useRouter();


    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        subscriptionPlanService.list().then((response) => {
            setPlans(response?.data?.data?.data)
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
            field: 'decimal_price',
            headerName: 'Price',
            width: 250
        },
        {
            field: null,
            headerName: 'Currency',
            width: 250,
            renderCell: (params) => {
                return (params.row?.currency?.iso_short_code);
            }
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 250
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
        },
    ];

    const handleRowClick = (params) => {
        // Handle the row click event
        console.log('Row clicked:', params.row);
        // You can perform actions based on the clicked row, such as navigating to a detail page

        router.push('/subscriptionPlan?id=' + params.row.uuid);
    };

    return (
        <>
            <Head>
                <title>
                    Subscription Plans | Liber
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
                                    Subscription Plans
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
                            <Card style={{ width: "100%" }}>
                                <DataGrid
                                    getRowId={(row) => row.uuid}
                                    rows={plans}
                                    columns={columns}
                                    initialState={{
                                        pagination: {
                                            paginationModel: { page: 0, pageSize: 10 },
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
