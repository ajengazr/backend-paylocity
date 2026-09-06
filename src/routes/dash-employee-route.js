import express from "express";
import DashboardEmployeeController from "../controllers/dashboard-employee-controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

export const dashEmployeeApi = express.Router();

dashEmployeeApi.get("/dashboard/employee/stats",
    authMiddleware,
    authorize("EMPLOYEE"),
    DashboardEmployeeController.getStats);

dashEmployeeApi.get("/dashboard/employee/chart",
    authMiddleware,
    authorize("EMPLOYEE"),
    DashboardEmployeeController.getChartData);

dashEmployeeApi.get("/dashboard/employee/overtime-history",
    authMiddleware,
    authorize("EMPLOYEE"),
    DashboardEmployeeController.getOvertimeHistory);

dashEmployeeApi.get("/dashboard/employee/activity-log",
    authMiddleware,
    authorize("EMPLOYEE"),
    DashboardEmployeeController.getActivityLog);

dashEmployeeApi.get("/dashboard/employee/payroll-summary",
    authMiddleware,
    authorize("EMPLOYEE"),
    DashboardEmployeeController.getPayrollSummary);

dashEmployeeApi.get("/dashboard/employee/payroll-periods",
    authMiddleware,
    authorize("EMPLOYEE"),
    DashboardEmployeeController.getPayrollPeriods);

dashEmployeeApi.get("/dashboard/employee",
    authMiddleware,
    authorize("EMPLOYEE"),
    DashboardEmployeeController.getDashboard);