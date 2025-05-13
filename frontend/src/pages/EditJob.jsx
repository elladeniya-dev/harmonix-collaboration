import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, MenuItem, Typography, Stack,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
  axios.get(`http://localhost:8080/api/job-post/${id}`, {
    withCredentials: true
  })
    .then(res => setFormData(res.data))
    .catch(err => {
      console.error(err);
      alert('Failed to fetch job details.');
    });
    }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();

    for (const key of ['title', 'description', 'skillsNeeded', 'collaborationType', 'availability']) {
      payload.append(key, formData[key]);
    }
    if (imageFile) payload.append('image', imageFile);

    try {
      await axios.put(`http://localhost:8080/api/job-post/${id}`, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Job updated!');
      navigate('/job');
    } catch (err) {
      console.error(err);
      alert('Error updating job.');
    }
  };

  if (!formData) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Update Job Post
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField name="title" label="Title" value={formData.title} onChange={handleChange} required fullWidth />
          <TextField name="description" label="Description" multiline rows={4} value={formData.description} onChange={handleChange} fullWidth required />
          <TextField name="skillsNeeded" label="Skills Needed" value={formData.skillsNeeded} onChange={handleChange} fullWidth required />
          <TextField select name="collaborationType" value={formData.collaborationType} onChange={handleChange} fullWidth required>
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="In-Person">In-Person</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
          </TextField>
          <TextField type="date" name="availability" label="Availability" InputLabelProps={{ shrink: true }} value={formData.availability} onChange={handleChange} fullWidth required />
          <Button variant="outlined" component="label">
            Upload New Image
            <input hidden type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </Button>
          <Button type="submit" variant="contained">Update</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default EditJob;
