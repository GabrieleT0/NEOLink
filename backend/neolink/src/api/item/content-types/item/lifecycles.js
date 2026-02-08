'use strict';

module.exports = {
    async afterCreate(event) {
        try {
            const { result } = event;
            if (!result?.documentId) {
                return;
            }
            await strapi.service('api::notification.notification').dispatchItemCreatedNotifications(result.documentId);
        } catch (error) {
            strapi.log.error('Failed to dispatch item notification alerts', error);
        }
    }
};
