import express from "express";
import * as notificationController from "../controllers/notification-controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const notificationApi = express.Router();

// Mendapatkan semua notifikasi user
notificationApi.get("/api/notifications", authMiddleware, notificationController.getMyNotifications);

// Mendapatkan jumlah notifikasi yang belum dibaca
notificationApi.get("/api/notifications/unread-count", authMiddleware, notificationController.getUnreadCount);

// Menandai satu notifikasi sebagai sudah dibaca
notificationApi.patch("/api/notifications/:id/read", authMiddleware, notificationController.markAsRead);

// Menandai semua notifikasi sebagai sudah dibaca
notificationApi.patch("/api/notifications/read-all", authMiddleware, notificationController.markAllAsRead);

// Menghapus semua notifikasi yang sudah dibaca
// WAJIB didaftarkan sebelum "/:id" agar tidak tertangkap sebagai parameter id
notificationApi.delete("/api/notifications/read", authMiddleware, notificationController.deleteReadNotifications);

// Menghapus satu notifikasi
notificationApi.delete("/api/notifications/:id", authMiddleware, notificationController.deleteNotification);

export default notificationApi;