import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, onDelete, onUpdate }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const isOwner = user && job.userId === user.id;

  const handleClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(job.id);
  };

  const handleUpdate = (e) => {
    e.stopPropagation();
    onUpdate(job);
  };

  const formattedDate = new Date(job.availability).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const skillChips = job.skillsNeeded?.split(',').map((skill) => (
    <Chip key={skill.trim()} label={skill.trim()} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
  ));

  return (
    <Card
      onClick={handleClick}
      sx={{
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.01)' },
      }}
    >
      {job.imageUrl && (
        <CardMedia
          component="img"
          height="180"
          image={job.imageUrl}
          alt={job.title}
        />
      )}

      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {job.description.length > 100 ? job.description.slice(0, 100) + '...' : job.description}
        </Typography>

        <Box mt={1}>{skillChips}</Box>

        <Typography variant="body2" mt={1}>
          <strong>Type:</strong> {job.collaborationType}
        </Typography>
        <Typography variant="body2">
          <strong>Available:</strong> {formattedDate}
        </Typography>

        {isOwner && (
          <Box mt={2} display="flex" gap={1}>
            <Button size="small" variant="outlined" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
