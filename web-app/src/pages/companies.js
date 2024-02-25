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
    Avatar,
    Switch,
    IconButton
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useEffect, useState } from 'react';
import CompanyService from 'api/CompanyService';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteConfirmationDialog from 'src/components/deleteConfirmationDialog';
import { CompanyStatus, SubscriptionPlanTypes } from 'helpers/constants';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SelectSubscriptioPlan from 'src/components/selectSubscriptioPlan';


const Page = () => {
    const companyService = new CompanyService();
    const [companies, setCompanies] = useState([]);
    const router = useRouter();

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idToBeDeleted, setIdToBeDeleted] = useState();

    const [isPlanDialogOpen, setPlanDialogOpen] = useState(false);

    const [company, setCompany] = useState(null);

    const handlePlanClick = (company) => {
        console.log('handlePlanClick', company);
        setCompany(company);
        setPlanDialogOpen(true);
    };

    const handlePlanCancel = () => {
        setPlanDialogOpen(false);
    };

    const handlePlanConfirm = () => {
        setCompany(null);
        setPlanDialogOpen(false);
    };


    const handleDeleteClick = (id) => {
        setDeleteDialogOpen(true);
        setIdToBeDeleted(id);
    };

    const handleDeleteConfirm = () => {
        companyService.deleteCompany({ uuid: idToBeDeleted }).then((response) => {
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
        companyService.list().then((response) => {
            setCompanies(response?.data?.data?.data)
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
                src={params.row.logo}
                sx={{
                    height: 40,
                    width: 40
                }}
            />
        );
    }

    const approveCompany = (uuid) => {
        companyService.update({ uuid, status: CompanyStatus.Active }).then((response) => {
            loadData();
        }).catch((error) => {
            // Handle API request errors here
            console.error(error);
            //throw new Error('Please check your email and password');
            throw new Error(error.message);
        });
    }

    const handleToggleStatus = (uuid, status) => {
        // Implement the logic to toggle the status based on the itemId
        status = status == CompanyStatus.PendingApproval || status == CompanyStatus.Disabled ? CompanyStatus.Active : CompanyStatus.Disabled;
        companyService.update({ uuid, status: status }).then((response) => {
            loadData();
        }).catch((error) => {
            // Handle API request errors here
            console.error(error);
            //throw new Error('Please check your email and password');
            throw new Error(error.message);
        });

    };

    const columns = [
        {
            field: 'logo',
            headerName: 'Logo',
            width: 150,
            renderCell: ImageCell
        },
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
        {
            field: 'status',
            type: 'actions',
            headerName: 'status',
            width: 140,
            cellClassName: 'status',
            getActions: (params) => {
                return [
                    params?.row?.status == CompanyStatus.PendingApproval ?
                        <IconButton color="success" onClick={() => approveCompany(params?.row?.uuid)}>
                            <CheckIcon />
                        </IconButton>
                        :
                        <Switch
                            checked={params?.row?.status === CompanyStatus.Active}
                            onChange={() => handleToggleStatus(params?.row?.uuid, params?.row?.status)}
                        />
                ];
            }
        },
        {
            field: 'plan',
            type: 'actions',
            headerName: 'Plan',
            width: 150,
            cellClassName: 'actions',

            getActions: (params, index) => {
                return [
                    <Button
                      key={"companies-actions-btn-" + index}
                        color={params?.row?.latest_subscription_plan?.is_active ? "success" : "warning"}
                        startIcon={(
                            <SvgIcon fontSize="small">
                                {params?.row?.latest_subscription_plan?.is_active ? <CheckIcon /> : <CloseIcon />}
                            </SvgIcon>
                        )}
                        variant="contained"
                        onClick={() => handlePlanClick(params?.row)}
                    >
                        {params?.row?.latest_subscription_plan ? params?.row?.latest_subscription_plan?.subscription_plan?.type : SubscriptionPlanTypes.Standard}
                    </Button>
                ];
            }
        }
    ];

    const handleRowClick = (params) => {
        // Handle the row click event
        console.log('Row clicked:', params.row);
        // You can perform actions based on the clicked row, such as navigating to a detail page

        router.push('/company?id=' + params.row.uuid);
    };

    const addCompany = () => {
        router.push('/company');
    }

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
                                    onClick={addCompany}
                                >
                                    Add
                                </Button>
                            </div>
                        </Stack>
                        {/* <CompaniesSearch /> */}
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

                                {company &&
                                    <SelectSubscriptioPlan
                                        company={company}
                                        open={isPlanDialogOpen}
                                        onClose={handlePlanCancel}
                                        onConfirm={handlePlanConfirm}
                                    />
                                }

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
