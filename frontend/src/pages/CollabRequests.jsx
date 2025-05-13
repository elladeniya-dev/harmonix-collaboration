import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Card, CardContent, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Chip,
  Tooltip, IconButton, Box, Grid
} from '@mui/material';
import { Edit, Send, Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from '../context/UserContext';

const CollabRequests = () => {
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/collab-requests/all', {
        withCredentials: true,
      });
      setRequests(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch collaboration requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/api/collab-requests/${requestId}/accept`, null, {
        withCredentials: true,
      });
      Swal.fire('Accepted!', 'Collaboration request accepted and message sent.', 'success');
      fetchRequests();
    } catch (err) {
      Swal.fire('Error', 'Could not accept request.', 'error');
      console.error(err);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      const confirm = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will permanently delete the request.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      });

      if (confirm.isConfirmed) {
        await axios.delete(`http://localhost:8080/api/collab-requests/${requestId}`, {
          withCredentials: true,
        });
        Swal.fire('Deleted!', 'Your request has been deleted.', 'success');
        fetchRequests();
      }
    } catch (err) {
      Swal.fire('Error', 'Could not delete request.', 'error');
      console.error(err);
    }
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8080/api/collab-requests/${editingId}`,
          { title, description },
          { withCredentials: true }
        );
        Swal.fire('Updated!', 'Collaboration request updated.', 'success');
      } else {
        await axios.post(
          'http://localhost:8080/api/collab-requests',
          { title, description },
          { withCredentials: true }
        );
        Swal.fire('Created!', 'Collaboration request created.', 'success');
      }
      handleClose();
      fetchRequests();
    } catch (err) {
      Swal.fire('Error', 'Could not save request.', 'error');
      console.error(err);
    }
  };

  const handleEdit = (req) => {
    setEditingId(req.id);
    setTitle(req.title);
    setDescription(req.description);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Typography variant="h4" align="center" sx={{ color: '#3f51b5', fontWeight: 'bold', mb: 4 }}>
        Public Collaboration Requests
      </Typography>

      <Box display="flex" justifyContent="center" mb={4}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Collaboration Request
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {requests.length === 0 ? (
            <Typography textAlign="center" color="textSecondary" width="100%">
              No collaboration requests found.
            </Typography>
          ) : (
            requests.map((req) => {
              const isCreator = req.creatorId === (user?.id || user?._id);
              return (
                <Grid item xs={12} key={req.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">
                          {req.title}
                        </Typography>
                        {isCreator && <Chip label="You" color="primary" size="small" />}
                      </Box>

                      <Typography variant="body2" color="textSecondary" mt={0.5}>
                        Posted by: {req.creatorEmail || req.creatorId}
                      </Typography>

                      <Typography variant="body1" mt={1.5}>
                        {req.description}
                      </Typography>

                      <Box display="flex" gap={1} mt={2}>
                        {!isCreator && (
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<Send />}
                            onClick={() => handleAccept(req.id)}
                          >
                            Apply
                          </Button>
                        )}
                        {isCreator && (
                          <>
                            <Tooltip title="Edit this request">
                              <IconButton color="info" onClick={() => handleEdit(req)}>
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete this request">
                              <IconButton color="error" onClick={() => handleDelete(req.id)}>
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Update Request' : 'Create Request'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOrUpdate}>
            {editingId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CollabRequests;
