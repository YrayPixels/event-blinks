'use client';
import { Typography } from '@mui/material';
import DashboardCard from '../components/shared/DashboardCard';
import PageContainer from '../components/container/PageContainer';



const SamplePage = () => {
  return (
    <PageContainer title="Sample Page" description="this is Sample page">
      <DashboardCard title="Sample Page">
        <Typography>This is a sample page</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

