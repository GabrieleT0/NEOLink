'use strict';

const getSellerDocumentId = (ctx) => ctx?.request?.body?.data?.user_id;

const findSellerEntity = async (documentId) => {
    if (!documentId) {
        return null;
    }

    return strapi.db.query('api::seller.seller').findOne({
        where: { documentId }
    });
};

module.exports = {
    async list(ctx) {
        try {
            const sellerDocumentId = getSellerDocumentId(ctx);
            if (!sellerDocumentId) {
                return ctx.unauthorized('Missing authentication payload');
            }

            const body = ctx.request.body || {};
            const filters = {
                seller: {
                    documentId: {
                        $eq: sellerDocumentId
                    }
                }
            };

            if (body.onlyUnread) {
                filters.is_read = { $eq: false };
            }

            const pageSize = Math.min(parseInt(body.pageSize, 10) || 20, 100);
            const page = Math.max(parseInt(body.page, 10) || 1, 1);
            const start = (page - 1) * pageSize;

            const notifications = await strapi.entityService.findMany('api::notification.notification', {
                filters,
                sort: { createdAt: 'DESC' },
                start,
                limit: pageSize,
                populate: {
                    item: {
                        fields: ['documentId', 'name', 'item_status', 'languages']
                    },
                    subscription: {
                        fields: ['documentId', 'name', 'criteria']
                    }
                }
            });

            return ctx.send({
                data: notifications,
                meta: {
                    page,
                    pageSize,
                    count: notifications.length
                }
            });
        } catch (error) {
            strapi.log.error('Failed to list notifications', error);
            return ctx.internalServerError('Unable to load notifications right now');
        }
    },

    async markRead(ctx) {
        try {
            const sellerDocumentId = getSellerDocumentId(ctx);
            if (!sellerDocumentId) {
                return ctx.unauthorized('Missing authentication payload');
            }

            const body = ctx.request.body || {};
            const { notificationId, is_read = true } = body;
            if (!notificationId) {
                return ctx.badRequest('Missing notification identifier');
            }

            const notification = await strapi.documents('api::notification.notification').findOne({
                documentId: notificationId,
                populate: { seller: true }
            });

            if (!notification) {
                return ctx.notFound('Notification not found');
            }

            if (notification.seller?.documentId !== sellerDocumentId) {
                return ctx.forbidden('You cannot modify this notification');
            }

            const updatedNotification = await strapi.documents('api::notification.notification').update({
                documentId: notificationId,
                data: { is_read: Boolean(is_read) }
            });

            return ctx.send({ data: updatedNotification });
        } catch (error) {
            strapi.log.error('Failed to update notification', error);
            return ctx.internalServerError('Unable to update notification right now');
        }
    },

    async markAllRead(ctx) {
        try {
            const sellerDocumentId = getSellerDocumentId(ctx);
            if (!sellerDocumentId) {
                return ctx.unauthorized('Missing authentication payload');
            }

            const sellerEntity = await findSellerEntity(sellerDocumentId);
            if (!sellerEntity) {
                return ctx.notFound('Seller not found');
            }

            await strapi.db.query('api::notification.notification').updateMany({
                where: {
                    seller: sellerEntity.id,
                    is_read: false
                },
                data: { is_read: true }
            });

            return ctx.send({ success: true });
        } catch (error) {
            strapi.log.error('Failed to mark notifications as read', error);
            return ctx.internalServerError('Unable to complete the operation right now');
        }
    },

    async unreadCount(ctx) {
        try {
            const sellerDocumentId = getSellerDocumentId(ctx);
            if (!sellerDocumentId) {
                return ctx.unauthorized('Missing authentication payload');
            }

            const count = await strapi.entityService.count('api::notification.notification', {
                filters: {
                    seller: {
                        documentId: {
                            $eq: sellerDocumentId
                        }
                    },
                    is_read: {
                        $eq: false
                    }
                }
            });

            return ctx.send({ data: { count } });
        } catch (error) {
            strapi.log.error('Failed to fetch unread notification count', error);
            return ctx.internalServerError('Unable to load notification count right now');
        }
    }
};
