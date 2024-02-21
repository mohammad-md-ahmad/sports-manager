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
    Card,
    Avatar
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import UserService from 'api/UserService';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteConfirmationDialog from 'src/components/deleteConfirmationDialog';
import { UserType } from 'helpers/constants';

const Page = () => {
    const userService = new UserService();
    const [customers, setCustomer] = useState([]);
    const router = useRouter();

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idToBeDeleted, setIdToBeDeleted] = useState();

    const handleDeleteClick = (id) => () => {
        setDeleteDialogOpen(true);
        setIdToBeDeleted(id);
    };

    const handleDeleteConfirm = () => {
        userService.deleteUser({ uuid: idToBeDeleted }).then((response) => {
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
        userService.list({ type: UserType.CustomerUser }).then((response) => {
            setCustomer(response?.data?.data?.data)
        }).catch((error) => {
            // Handle API request errors here
            console.error(error);
            //throw new Error('Please check your email and password');
            throw new Error(error.message);
        });
    }

    function ImageCell(params) {
        return (
            <Avatar
                src={params.row.profile_picture}
                sx={{
                    height: 40,
                    width: 40
                }}
            />
        );
    }

    const columns = [
        {
            field: 'profile_picture',
            headerName: 'Photo',
            width: 150,
            renderCell: ImageCell
        },
        {
            field: 'full_name',
            headerName: 'Name',
            width: 250
        },
        {
            field: 'username',
            headerName: 'Username',
            width: 150,
        }, {
            field: 'email',
            headerName: 'Email',
            width: 250,
        },
        {
            field: 'address',
            headerName: 'Address',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            flex: 1,
            valueGetter: (params) =>
                `${params.row.address ?
                    (params.row.address.country.name) +
                    (params.row.address.region ? ', ' + params.row.address.region : '') +
                    (params.row.address.city ? ', ' + params.row.address.city : '')
                    : ''}`,
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
                        key={"customer-"+id}
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            }
        }
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

        router.push('/customer?id=' + params.row.uuid);
    };

    const addCustomer = () => {
        router.push('/customer');
    }

    return (
        <>
            <Head>
                <title>
                    Customers | Liber
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
                                    Customers
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
                                    onClick={addCustomer}
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
                                    rows={customers}
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
