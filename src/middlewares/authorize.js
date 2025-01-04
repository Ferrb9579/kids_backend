// src/middlewares/authorize.js
export const authorize = (requiredPermission, roleType = 'user') => {
    return (req, res, next) => {
        let userBitmask = 0;

        if (roleType === 'user') {
            // Aggregate all user role bitmasks assigned to the user
            userBitmask = req.userRoles.reduce((acc, role) => acc | role.bitmask, 0);
        } else if (roleType === 'event') {
            // Aggregate all event role bitmasks assigned to the user for the specific event
            userBitmask = req.eventRoles.reduce((acc, role) => acc | role.bitmask, 0);
        }

        if ((userBitmask & requiredPermission) === requiredPermission) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'You do not have the required permissions.',
            });
        }
    };
};
