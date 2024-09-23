import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Alert, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from '../app/theme';

const ForumsOrderAdmin = ({ setAlertMessage, setAlertSeverity }) => {
  const [forums, setForums] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState('');

  const fetchForums = async () => {
    try {
      const forumsCollection = collection(db, 'forums');
      const forumsSnapshot = await getDocs(forumsCollection);
      const forumsList = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      forumsList.sort((a, b)=> a.orderIdx - b.orderIdx);
      setForums(forumsList);
    } catch (err) {
      setError('Failed to fetch forums.');
    }
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const handleDeleteForum = async (id) => {
    try {
      await deleteDoc(doc(db, 'forums', id));
      fetchForums();
    } catch (err) {
      setError('Failed to delete forum.');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(forums);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update orderIdx for each item
    for (let i = 0; i < items.length; i++) {
      items[i].orderIdx = i;
    }

    setForums(items);
    setHasChanges(true); // Mark changes as made
  };

  const handleSaveChanges = async () => {
    try {
      for (let i = 0; i < forums.length; i++) {
        await updateDoc(doc(db, 'forums', forums[i].id), { orderIdx: forums[i].orderIdx });
      }
      setHasChanges(false); // Reset changes status
      setAlertMessage('Changes saved successfully!');
      setAlertSeverity('success');
    } catch (error) {
      setAlertMessage('Failed to save changes. Please try again.');
      setAlertSeverity('error');
    }
  };

  return (
    <>
      {error && <Alert severity="error" sx={{ marginBottom: theme.spacing(2) }}>{error}</Alert>}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="forums">
          {(provided) => (
            <List {...provided.droppableProps} ref={provided.innerRef} sx={{ width: '95%' }}>
              {forums.map((forum, index) => (
                <Draggable key={forum.id} draggableId={forum.id} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ backgroundColor: theme.palette.background.paper, marginBottom: theme.spacing(1), borderRadius: theme.shape.borderRadius }}
                    >
                      <ListItemText primary={forum.name} secondary={forum.description} sx={{ color: theme.palette.primary.main }} />
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteForum(forum.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveChanges}
        disabled={!hasChanges}
        sx={{ marginTop: theme.spacing(2) }}
      >
        Save Changes
      </Button>
    </>
  );
};

export default ForumsOrderAdmin;
