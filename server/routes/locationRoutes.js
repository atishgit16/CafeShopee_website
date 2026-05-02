// server/routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getAvailableTables,
  reserveTable,
  addTable,
  removeTable
} = require('../controller/locationController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.get('/:id/tables', getAvailableTables);

// Protected routes
router.post('/:id/tables/:tableNumber/reserve', authMiddleware, reserveTable);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createLocation);
router.put('/:id', authMiddleware, adminMiddleware, updateLocation);
router.delete('/:id', authMiddleware, adminMiddleware, deleteLocation);
router.post('/:id/tables', authMiddleware, adminMiddleware, addTable);
router.delete('/:id/tables/:tableNumber', authMiddleware, adminMiddleware, removeTable);

module.exports = router;