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
            <OverviewTotalBookingRequests
              sx={{ height: '100%' }}
              value={systemMetrics.total_booking_requests}
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
            lg={4}
          >
            <OverviewLatestProducts
              products={[
                {
                  id: '5ece2c077e39da27658aa8a9',
                  image: '/assets/products/product-1.png',
                  name: 'Healthcare Erbology',
                  updatedAt: subHours(now, 6).getTime()
                },
                {
                  id: '5ece2c0d16f70bff2cf86cd8',
                  image: '/assets/products/product-2.png',
                  name: 'Makeup Lancome Rouge',
                  updatedAt: subDays(subHours(now, 8), 2).getTime()
                },
                {
                  id: 'b393ce1b09c1254c3a92c827',
                  image: '/assets/products/product-5.png',
                  name: 'Skincare Soja CO',
                  updatedAt: subDays(subHours(now, 1), 1).getTime()
                },
                {
                  id: 'a6ede15670da63f49f752c89',
                  image: '/assets/products/product-6.png',
                  name: 'Makeup Lipstick',
                  updatedAt: subDays(subHours(now, 3), 3).getTime()
                },
                {
                  id: 'bcad5524fe3a2f8f8620ceda',
                  image: '/assets/products/product-7.png',
                  name: 'Healthcare Ritual',
                  updatedAt: subDays(subHours(now, 5), 6).getTime()
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={8}
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
