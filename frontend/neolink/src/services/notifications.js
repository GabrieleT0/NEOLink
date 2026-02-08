import axios from "axios";
import { base_url } from "../api";

const buildBody = (token, payload = {}) => ({
    ...(payload || {}),
    token
});

const postWithToken = async (endpoint, token, payload) => {
    const response = await axios.post(`${base_url}${endpoint}`, buildBody(token, payload));
    return response.data;
};

export const notificationsApi = {
    listSubscriptions: (token, payload = {}) => postWithToken('/custom-notification-subscription/list', token, payload),
    createSubscription: (token, payload) => postWithToken('/custom-notification-subscription/create', token, payload),
    updateSubscription: (token, payload) => postWithToken('/custom-notification-subscription/update', token, payload),
    deleteSubscription: (token, payload) => postWithToken('/custom-notification-subscription/delete', token, payload),
    listNotifications: (token, payload = {}) => postWithToken('/custom-notification/list', token, payload),
    markNotificationRead: (token, payload) => postWithToken('/custom-notification/mark-read', token, payload),
    markAllNotificationsRead: (token) => postWithToken('/custom-notification/mark-all-read', token),
    getUnreadCount: (token) => postWithToken('/custom-notification/unread-count', token)
};
