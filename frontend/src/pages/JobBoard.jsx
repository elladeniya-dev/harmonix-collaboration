import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobCard from '../components/JobCard';
import { Typography, CircularProgress, Grid, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // at the top

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/job-post', {
      withCredentials: true,
    })
      .then((response) => {
        setJobs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
        setError('There was an error fetching job posts. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleDelete = (jobId) => {
    axios.delete(`http://localhost:8080/api/job-post/${jobId}`, {
      withCredentials: true,
    })
      .then(() => {
        alert('Job post deleted successfully');
        setJobs(jobs.filter(job => job.id !== jobId));
      })
      .catch((error) => {
        console.error('Error deleting job:', error);
        alert('Error deleting the job post');
      });
  };
  const navigate = useNavigate(); // inside your component
  const handleUpdate = (job) => {
    navigate(`/job/${job.id}`);
  };

  return (
    <Box sx={{ px: 3, pt: 2 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Collaboration Opportunities
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : jobs.length === 0 ? (
        <Typography>No jobs posted yet.</Typography>
      ) : (
        <Grid container columns={12} spacing={3}>
          {jobs.map((job) => (
            <Grid key={job.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <JobCard job={job} onDelete={handleDelete} onUpdate={handleUpdate} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default JobBoard;
