import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { OverviewTotalCompanies } from 'src/sections/overview/overview-total-companies';
import { OverviewTotalBookingRequests } from 'src/sections/overview/overview-total-booking-requests';
import ReportsService from 'api/ReportsService';
import { useEffect, useState } from 'react';
import { OverviewPendingCompaniesCount } from 'src/sections/overview/overview-pending-companies-count';
import CompanyService from 'api/CompanyService';
import { CompanyStatus } from 'helpers/constants';
import { OverviewPendingApprovalCompanies } from 'src/sections/overview/overview-pending-approval-companies';
import { OverviewLatestCustomers } from 'src/sections/overview/overview-latest-customers';

const now = new Date();

const Page = () => {
  const reportsService = new ReportsService();
  const companyService = new CompanyService();
  const [systemMetrics, setSystemMetrics] = useState({});
  const [pendingApprovalCompanies, setPendingApprovalCompanies] = useState([]);

  useEffect(() => {
    reportsService.getReport({ key: 'SystemMetrics' }).then((response) => {
      setSystemMetrics(response.data?.data);
    }).catch((error) => {
      // Handle API request errors here
      console.error(error);
      //throw new Error('Please check your email and password');
      throw new Error(error.message);
    });

    loadPendingApprovalCompanies();

  }, [])


  const loadPendingApprovalCompanies = () => {
    companyService.list({ status: CompanyStatus.PendingApproval }).then((response) => {
      setPendingApprovalCompanies(response.data?.data?.data);
    }).catch((error) => {
      // Handle API request errors here
      console.error(error);
      //throw new Error('Please check your email and password');
      throw new Error(error.message);
    });
  }

  return (<>
    <Head>
      <title>
        Overview | Liber
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
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCompanies
              //difference={16}
              //positive={true}
              sx={{ height: '100%' }}
              value={systemMetrics.total_companies}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewPendingCompaniesCount
              //difference={16}
              //positive={true}
              sx={{ height: '100%' }}
              value={pendingApprovalCompanies?.length}
            />

          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalCustomers
              // difference={16}
              //positive={false}
              sx={{ height: '100%' }}
              value={systemMetrics.total_customers}
            />
          </Grid>
          <Grid
            xs={12}
            sm={6}
            lg={3}
          >
            <OverviewTotalBookingRequests
              sx={{ height: '100%' }}
              value={systemMetrics.total_booking_requests}
            />
          </Grid>
          {/* <Grid
            xs={12}
            lg={8}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'This year',
                  data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                },
                {
                  name: 'Last year',
                  data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid> */}
          {/* <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewTraffic
              chartSeries={[63, 15, 22]}
              labels={['Desktop', 'Tablet', 'Phone']}
              sx={{ height: '100%' }}
            />
          </Grid> */}
          <Grid
            xs={12}
            md={6}
            lg={6}
          >
            <OverviewLatestCustomers
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={6}
          >
            <OverviewPendingApprovalCompanies
              companies={pendingApprovalCompanies}
              loadData={loadPendingApprovalCompanies}
              sx={{ height: '100%' }}
            />
          </Grid>
        </Grid>
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
