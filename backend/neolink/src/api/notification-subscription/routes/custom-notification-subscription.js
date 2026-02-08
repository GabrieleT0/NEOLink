module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/custom-notification-subscription/list',
            handler: 'custom-notification-subscription.list',
            config: {
                middlewares: ['global::otp-auth']
            }
        },
        {
            method: 'POST',
            path: '/custom-notification-subscription/create',
            handler: 'custom-notification-subscription.create',
            config: {
                middlewares: ['global::otp-auth']
            }
        },
        {
            method: 'POST',
            path: '/custom-notification-subscription/update',
            handler: 'custom-notification-subscription.update',
            config: {
                middlewares: ['global::otp-auth']
            }
        },
        {
            method: 'POST',
            path: '/custom-notification-subscription/delete',
            handler: 'custom-notification-subscription.delete',
            config: {
                middlewares: ['global::otp-auth']
            }
        }
    ]
};
