// src/routes/index.js
import express from 'express';
import userRoutes from './user.routes.js';
import permissionRoutes from './permission.routes.js';
import userPermissionRoutes from './userPermission.routes.js';
import eventRoutes from './event.routes.js';
import eventRegistrationRoutes from './eventRegistration.routes.js';
import attendanceSessionRoutes from './attendanceSession.routes.js';
import attendanceRoutes from './attendance.routes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/permissions', permissionRoutes);
router.use('/user-permissions', userPermissionRoutes);
router.use('/events', eventRoutes);
router.use('/event-registrations', eventRegistrationRoutes);
router.use('/attendance-sessions', attendanceSessionRoutes);
router.use('/attendance', attendanceRoutes);

export default router;
