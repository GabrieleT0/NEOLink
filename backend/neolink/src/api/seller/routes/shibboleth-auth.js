/**
 * Shibboleth Authentication Routes for NEOLink
 * 
 * These routes handle eduGAIN/Shibboleth authentication.
 * The actual Shibboleth authentication is handled by Apache mod_shib,
 * these endpoints process the authenticated session.
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/auth/shibboleth',
            handler: 'shibboleth-auth.authenticate',
            config: {
                auth: false,
                description: 'Shibboleth authentication callback'
            }
        },
        {
            method: 'GET',
            path: '/auth/shibboleth/session',
            handler: 'shibboleth-auth.session',
            config: {
                auth: false,
                description: 'Check Shibboleth session status'
            }
        },
        {
            method: 'GET',
            path: '/auth/shibboleth/logout',
            handler: 'shibboleth-auth.logout',
            config: {
                auth: false,
                description: 'Shibboleth logout'
            }
        },
    ]
};
