// DeleteConfirmationDialog.js
import React, { useEffect, useState } from 'react';
import {
    Unstable_Grid2 as Grid,
    Card,
    Avatar,
    IconButton,
    Switch
} from '@mui/material';
import FacilityService from 'api/FacilityService';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteConfirmationDialog from 'src/components/deleteConfirmationDialog';
import { CompanyFacilityStatus } from 'helpers/constants';
import CheckIcon from '@mui/icons-material/Check';

const Facilities = ({ companyUuid }) => {
    const facilityService = new FacilityService();
    const [facilities, setFacilities] = useState([]);
    const router = useRouter();

    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [idToBeDeleted, setIdToBeDeleted] = useState();

    const handleDeleteClick = (id) => () => {
        setDeleteDialogOpen(true);
        setIdToBeDeleted(id);
    };

    const handleDeleteConfirm = () => {
        facilityService.deleteCompany({ uuid: idToBeDeleted }).then((response) => {
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
        facilityService.listByCompany(companyUuid).then((response) => {
            setFacilities(response?.data?.data)
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
                src={params?.row?.logo}
                sx={{
                    height: 40,
                    width: 40
                }}
            />
        );
    }

    const approveFacility = (uuid) => {
        facilityService.update({ uuid, companyUuid, status: CompanyFacilityStatus.Active }).then((response) => {
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
        status = status == CompanyFacilityStatus.PendingApproval || status == CompanyFacilityStatus.Disabled ? CompanyFacilityStatus.Active : CompanyFacilityStatus.Disabled;
        facilityService.update({ uuid, companyUuid, status: status }).then((response) => {
            loadData();
        }).catch((error) => {
            // Handle API request errors here
            console.error(error);
            //throw new Error('Please check your email and password');
            throw new Error(error.message);
        });

    };

    const columns = [
        // {
        //     field: 'logo',
        //     headerName: 'Logo',
        //     width: 150,
        //     renderCell: ImageCell
        // },
        {
            field: 'name',
            headerName: 'Name',
            width: 200
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 250,
        },
        {
            field: 'address',
            headerName: 'Address',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 250,
            valueGetter: (params) =>
                `${params.row?.address ?
                    (params.row?.address.country.name) +
                    (params.row?.address.region ? ', ' + params.row?.address.region : '') +
                    (params.row?.address.city ? ', ' + params.row?.address.city : '')
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
                    params?.row?.status == CompanyFacilityStatus.PendingApproval ?
                        <IconButton color="success" onClick={() => approveFacility(params?.row?.uuid)}>
                            <CheckIcon />
                        </IconButton>
                        :
                        <Switch
                            checked={params?.row?.status === CompanyFacilityStatus.Active}
                            onChange={() => handleToggleStatus(params?.row?.uuid, params?.row?.status)}
                        />
                ];
            }
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
                        key={"facility-" + id}
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
        console.log('Row clicked:', params?.row);
        // You can perform actions based on the clicked row, such as navigating to a detail page

        router.push('/facility?id=' + params?.row?.uuid + '&companyId=' + companyUuid);
    };

    const addCompany = () => {
        router.push('/facility');
    }

    return (
        <Card style={{ width: "100%" }}>
            <DataGrid
                getRowId={(row) => row?.uuid}
                rows={facilities}
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
    );
};

export default Facilities;
