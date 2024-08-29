'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from './firebase'; // Adjust based on the actual relative path

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
}

export default function Home() {
  const [inventorytrackerapp, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [editItemName, setEditItemName] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const editItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), selectedItem)
    await updateDoc(docRef, { name: editItemName })
    setEditOpen(false)
    setSelectedItem(null)
    setEditItemName('')
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      await deleteDoc(docRef)
    }
    await updateInventory()
  }

  const adjustQuantity = async (item, adjustment) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      const newQuantity = Math.max(quantity + adjustment, 0) // Prevent negative quantities
      await updateDoc(docRef, { quantity: newQuantity })
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleEditOpen = (item) => {
    setSelectedItem(item)
    setEditItemName(item)
    setEditOpen(true)
  }
  const handleEditClose = () => setEditOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={1}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={style}>
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="edit-outlined-basic"
              label="Edit Item"
              variant="outlined"
              fullWidth
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                editItem(editItemName)
              }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>

      
      <Box border={'1px solid #333'}>
        <Box
          width="1550px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'} >
            Pantry Tracker App
          </Typography>
        </Box>
        <Stack width="1550px" height="550px" spacing={2} overflow={'auto'}>
          
          {inventorytrackerapp.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="70px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={4}
            >
              
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'#333'}>
                  Quantity: {quantity }
                </Typography>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => adjustQuantity(name, -1)}
                  disabled={quantity <= 0}
                >
                  -
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => adjustQuantity(name, 1)}
                >
                  +
                </Button>
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditOpen(name)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
                <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
