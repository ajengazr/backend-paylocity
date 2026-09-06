import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import departmentController from "../controllers/department-controller.js";

export const departmentApi = express.Router();

// Create - hanya SUPER_ADMIN dan HR_ADMIN
departmentApi.post("/api/departments",
    authMiddleware,
    authorize("SUPER_ADMIN", "HR_ADMIN"),
    departmentController.createDepartment
);

departmentApi.get("/api/departments",
    authMiddleware,
    authorize("SUPER_ADMIN", "HR_ADMIN"),
    departmentController.getAllDepartments
);

// Get By Id
departmentApi.get("/api/departments/:id",
    authMiddleware,
    authorize("SUPER_ADMIN", "HR_ADMIN"),
    departmentController.getDepartmentById
);

// Update - hanya SUPER_ADMIN dan HR_ADMIN
departmentApi.put("/api/departments/:id",
    authMiddleware,
    authorize("SUPER_ADMIN", "HR_ADMIN"),
    departmentController.updateDepartment
);

// Delete - hanya SUPER_ADMIN
departmentApi.delete("/api/departments/:id",
    authMiddleware,
    authorize("SUPER_ADMIN"),
    departmentController.removeDepartment
);