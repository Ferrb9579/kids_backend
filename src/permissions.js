// src/permissions.js

// User Permissions
export const CREATE_EVENT = 1 << 0; // 1
export const MANAGE_USER_ROLES = 1 << 1; // 2
export const VIEW_ATTENDANCE = 1 << 2; // 4
export const MANAGE_USERS = 1 << 3; // 8
export const SEND_NOTIFICATIONS = 1 << 4; // 16
export const MANAGE_PERMISSIONS = 1 << 5; // 32
export const VIEW_EVENTS = 1 << 6; // 64
export const DELETE_EVENTS = 1 << 7; // 128
export const MODIFY_EVENTS = 1 << 8; // 256
export const MARK_ATTENDANCE = 1 << 9; // 512

// Event Permissions
export const EVENT_MARK_ATTENDANCE = 1 << 0; // 1
export const EVENT_MODIFY_EVENT = 1 << 1; // 2
export const EVENT_DELETE_EVENT = 1 << 2; // 4
export const EVENT_VIEW_ATTENDANCE = 1 << 3; // 8
export const EVENT_SEND_NOTIFICATIONS = 1 << 4; // 16
