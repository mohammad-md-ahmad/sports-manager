import { format } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { SeverityPill } from 'src/components/severity-pill';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { CompanyStatus } from 'helpers/constants';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useRouter } from 'next/router';
import CompanyService from 'api/CompanyService';

export const OverviewPendingApprovalCompanies = (props) => {
  const { companies = [], loadData, sx } = props;
  const router = useRouter();

  const companyService = new CompanyService();

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

  const columns = [
    {
      field: 'logo',
      headerName: 'Logo',
      width: 100,
      renderCell: ImageCell
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200
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
            <></>
        ];
      }
    }
  ];

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

  const handleRowClick = (params) => {
    // Handle the row click event
    console.log('Row clicked:', params.row);
    // You can perform actions based on the clicked row, such as navigating to a detail page

    router.push('/company?id=' + params.row.uuid);
  };

  const viewAll = () => {
    router.push('/companies');
  };



  return (
    <Card sx={sx}>
      <CardHeader title="Peending Approval Companies" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ minWidth: 600 }}>
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
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
          variant="text"
          onClick={() => viewAll()}
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewPendingApprovalCompanies.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
