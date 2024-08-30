'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from '@mui/material'
import { firestore } from './firebase'

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
  const [filteredInventory, setFilteredInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [editItemName, setEditItemName] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })

    // Sort alphabetically
    inventoryList.sort((a, b) => a.name.localeCompare(b.name))

    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    try {
      if (!item) return
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const editItem = async () => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), selectedItem)
      await updateDoc(docRef, { name: editItemName })
      setEditOpen(false)
      setSelectedItem(null)
      setEditItemName('')
      await updateInventory()
    } catch (error) {
      console.error('Error editing item:', error)
    }
  }

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      await deleteDoc(docRef)
      await updateInventory()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const adjustQuantity = async (item, adjustment) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        const newQuantity = Math.max(quantity + adjustment, 0)
        await updateDoc(docRef, { quantity: newQuantity })
        await updateInventory()
      } else {
        console.error('Error: No document found to adjust quantity.')
      }
    } catch (error) {
      console.error('Error adjusting quantity:', error)
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleEditOpen = (item) => {
    setSelectedItem(item)
    setEditItemName(item)
    setEditOpen(true)
  }
  const handleEditClose = () => setEditOpen(false)

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase()
    setSearchTerm(value)
    const filtered = inventorytrackerapp.filter((item) =>
      item.name.toLowerCase().includes(value)
    )
    setFilteredInventory(filtered)
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={1}
      bgcolor={'#f0f0f0'}
      padding={4}
    >
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6">Add Item</Typography>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Item"
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

      <Modal open={editOpen} onClose={handleEditClose}>
        <Box sx={style}>
          <Typography variant="h6">Edit Item</Typography>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Edit Item"
              fullWidth
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
            />
            <Button variant="outlined" onClick={editItem}>
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box border={'1px solid #333'} width="1550px" borderRadius="8px" boxShadow={2}>
        <Box
          width="100%"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          paddingX={4}
          borderRadius="8px 8px 0 0"
        >
          <Typography variant={'h2'} color={'#333'}>
            Pantry Tracker App
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ bgcolor: 'white', borderRadius: '4px' }}
          />
          <Button variant="contained" onClick={handleOpen}>
            Add New Item
          </Button>
        </Box>

        <Stack width="100%" height="550px" spacing={2} overflow={'auto'} padding={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="70px"
              display={'grid'}
              gridTemplateColumns={'2fr 1fr 1fr 2fr'}
              alignItems={'center'}
              bgcolor={'#e8eaf6'}
              paddingX={4}
              borderRadius="8px"
              boxShadow={1}
              gap={2}
            >
              <Typography variant={'h5'}>{name}</Typography>
              <Typography variant={'h5'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction={'row'} spacing={1}>
                <Button
                  variant="outlined"
                  onClick={() => adjustQuantity(name, -1)}
                  disabled={quantity <= 0}
                >
                  -
                </Button>
                <Button variant="outlined" onClick={() => adjustQuantity(name, 1)}>
                  +
                </Button>
              </Stack>
              <Stack direction={'row'} spacing={1}>
                <Button variant="contained" color="primary" onClick={() => handleEditOpen(name)}>
                  Edit
                </Button>
                <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
