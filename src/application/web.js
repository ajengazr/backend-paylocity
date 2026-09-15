import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookie from "cookie-parser";
import { authApi } from "../routes/auth-router.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import { protectedApi } from "../routes/protected.api.js";
import { employeeApi } from "../routes/employee-route.js";
import { departmentApi } from "../routes/department-route.js";
import { positionApi } from "../routes/position-route.js";
import { overtimeApi } from "../routes/overtime-route.js";
import payrollApi from "../routes/payroll-route.js";
import dashboardApi from "../routes/dashboard-route.js";
import { payslipApi } from "../routes/payslip-route.js";
import { dashEmployeeApi } from "../routes/dash-employee-route.js";
import notificationApi from "../routes/notification-route.js";
import { reportApi } from "../routes/report-route.js";
import { leaveApi } from "../routes/leave-route.js";
const web = express();

// Asal frontend dibaca dari environment dan boleh berisi lebih dari satu alamat,
// dipisah koma. Sebelumnya nilainya ditulis mati ke localhost, sehingga backend
// yang sudah di-deploy menolak permintaan dari frontend produksinya sendiri.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Di belakang proxy (Vercel, Railway, Nginx) alamat asli pengunjung ada di
// X-Forwarded-For. Tanpa ini pembatas laju melihat semua permintaan datang dari
// satu IP proxy, sehingga satu penyerang bisa mengunci seluruh pengguna.
web.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS || 1));

// Header keamanan dasar: sembunyikan X-Powered-By, pasang HSTS, larang MIME
// sniffing, dan matikan referrer lintas situs.
web.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

web.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
web.use(cookie());

// Batas ukuran body. Tanpa batas, satu permintaan besar cukup untuk menghabiskan
// memori proses. Tidak ada endpoint di aplikasi ini yang perlu lebih dari ini.
web.use(express.json({ limit: "100kb" }));

// Pembatas laju umum untuk seluruh API.
web.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, errors: "Terlalu banyak permintaan. Coba lagi nanti." }
}));

// Pembatas jauh lebih ketat untuk endpoint yang menerima kata sandi, supaya
// percobaan tebak-menebak tidak bisa dijalankan beruntun.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { success: false, errors: "Terlalu banyak percobaan masuk. Coba lagi dalam 15 menit." }
});

web.use("/api/users/login", authLimiter);
web.use("/api/users/register", authLimiter);
web.use(authApi);
web.use(protectedApi);
web.use(employeeApi);
web.use(departmentApi);
web.use(positionApi);
web.use(overtimeApi);
web.use(payrollApi);
web.use(payslipApi);
web.use(dashboardApi);
web.use(dashEmployeeApi);
web.use(reportApi);
web.use(notificationApi);
web.use(leaveApi);
web.use(errorMiddleware);

export { web };