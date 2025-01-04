// src/routes/index.js
import express from 'express';
import userRoutes from './user.routes.js';
import eventRoutes from './event.routes.js';
import eventRegistrationRoutes from './eventRegistration.routes.js';
import attendanceSessionRoutes from './attendanceSession.routes.js';
import attendanceRoutes from './attendance.routes.js';
import notificationRoutes from './notification.routes.js';
import userRoleRoutes from './userRole.routes.js'; // Import User Role routes
import eventRoleRoutes from './eventRole.routes.js'; // Import Event Role routes
import userRoleAssignmentRoutes from './userRoleAssignment.routes.js'; // Import User Role Assignment routes
import eventRoleAssignmentRoutes from './eventRoleAssignment.routes.js'; // Import Event Role Assignment routes

const router = express.Router();

router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/event-registrations', eventRegistrationRoutes);
router.use('/attendance-sessions', attendanceSessionRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/notifications', notificationRoutes);

// New Routes
router.use('/user-roles', userRoleRoutes);
router.use('/event-roles', eventRoleRoutes);
router.use('/user-role-assignments', userRoleAssignmentRoutes);
router.use('/event-role-assignments', eventRoleAssignmentRoutes);

export default router;
