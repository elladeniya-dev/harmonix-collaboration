import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/job-post/${id}`, {
          withCredentials: true,
        });
        setJob(res.data);
      } catch (err) {
        console.error('Error fetching job:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <Container maxWidth="sm" sx={{ mt: 10 }}>
          <Typography variant="h6" color="error">
            Job not found.
          </Typography>
        </Container>
      </MainLayout>
    );
  }

  return (
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4}>
            {job.imageUrl && (
              <Grid item xs={12} md={5}>
                <Box
                  component="img"
                  src={job.imageUrl}
                  alt={job.title}
                  sx={{ width: '100%', borderRadius: 2, objectFit: 'cover' }}
                />
              </Grid>
            )}

            <Grid item xs={12} md={job.imageUrl ? 7 : 12}>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                {job.title}
              </Typography>

              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Posted by: <Chip label={job.contactMethod} avatar={<Avatar>{job.contactMethod?.[0]}</Avatar>} />
              </Typography>

              <Typography variant="body1" sx={{ my: 2 }}>
                {job.description}
              </Typography>

              <Box sx={{ my: 2 }}>
                <Chip label={`Skills: ${job.skillsNeeded}`} color="default" sx={{ mr: 1 }} />
                <Chip label={`Type: ${job.collaborationType}`} color="info" sx={{ mr: 1 }} />
                <Chip label={`Availability: ${job.availability}`} color="success" />
              </Box>

              <Box mt={3}>
                <Button variant="contained" size="large" color="secondary">
                  Send Collaboration Request
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
  );
};

export default JobDetails;
