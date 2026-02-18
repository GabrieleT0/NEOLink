module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/custom-notification/list',
            handler: 'custom-notification.list',
            config: {
                middlewares: ['global::otp-auth']
            }
        },
        {
            method: 'POST',
            path: '/custom-notification/mark-read',
            handler: 'custom-notification.markRead',
            config: {
                middlewares: ['global::otp-auth']
            }
        },
        {
            method: 'POST',
            path: '/custom-notification/mark-all-read',
            handler: 'custom-notification.markAllRead',
            config: {
                middlewares: ['global::otp-auth']
            }
        },
        {
            method: 'POST',
            path: '/custom-notification/unread-count',
            handler: 'custom-notification.unreadCount',
            config: {
                middlewares: ['global::otp-auth']
            }
        }
    ]
};
