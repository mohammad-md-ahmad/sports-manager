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
import { CompanyStatus, UserType } from 'helpers/constants';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useRouter } from 'next/router';
import CompanyService from 'api/CompanyService';
import UserService from 'api/UserService';
import { useEffect, useState } from 'react';

export const OverviewLatestCustomers = (props) => {
  const router = useRouter();
  const userService = new UserService();
  const [customers, setCustomer] = useState([]);

  const { sx } = props;

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
      field: 'profile_picture',
      headerName: 'Photo',
      width: 100,
      renderCell: ImageCell
    },
    {
      field: 'full_name',
      headerName: 'Name',
      flex: 1
    }
  ];


  const handleRowClick = (params) => {
    // Handle the row click event
    console.log('Row clicked:', params.row);
    // You can perform actions based on the clicked row, such as navigating to a detail page

    router.push('/customer?id=' + params.row.uuid);
  };

  const viewAll = () => {
    router.push('/customers');
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Latest Customers" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ maxWidth: '90%', marginLeft: '5%' }}>
          <DataGrid
            getRowId={(row) => row.uuid}
            rows={customers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick

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

OverviewLatestCustomers.prototype = {
  orders: PropTypes.array,
  sx: PropTypes.object
};
