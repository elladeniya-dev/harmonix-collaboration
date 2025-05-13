import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Stack,
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsNeeded: '',
    collaborationType: '',
    availability: new Date(),
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    if (!date) return;
    setFormData((prev) => ({
      ...prev,
      availability: date,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
  
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('skillsNeeded', formData.skillsNeeded);
      payload.append('collaborationType', formData.collaborationType);
      payload.append('availability', formData.availability.toISOString().split('T')[0]);
  
      if (formData.image) {
        payload.append('image', formData.image);
      }
  
      const res = await axios.post('http://localhost:8080/api/job-post', payload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert('Job posted successfully!');
      console.log(res.data);
  
      setFormData({
        title: '',
        description: '',
        skillsNeeded: '',
        collaborationType: '',
        availability: new Date(),
        image: null,
      });
    } catch (err) {
      console.error(err);
      alert('Error posting job: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Create a Collaboration Opportunity
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="title"
            label="Job Title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            required
          />

          <TextField
            name="description"
            label="Job Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />

          <TextField
            name="skillsNeeded"
            label="Skills / Qualifications"
            fullWidth
            value={formData.skillsNeeded}
            onChange={handleChange}
            required
          />

          <TextField
            select
            label="Collaboration Type"
            name="collaborationType"
            value={formData.collaborationType}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="Remote">Remote</MenuItem>
            <MenuItem value="In-Person">In-Person</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Expected Availability / Deadline"
              format="dd/MM/yyyy"
              value={formData.availability}
              onChange={handleDateChange}
              shouldDisableDate={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time
                return date < today;
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />

          </LocalizationProvider>

          <Button variant="outlined" component="label">
            Upload Image
            <input hidden accept="image/*" type="file" onChange={handleImageChange} />
          </Button>

          {formData.image && (
            <Typography variant="body2" color="text.secondary">
              Selected File: {formData.image.name}
            </Typography>
          )}

          <Button type="submit" variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default PostJob;
