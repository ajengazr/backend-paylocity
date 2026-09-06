import { ResponseError } from "../errors/response.error.js";
import joi from "joi";

export function errorMiddleware(err, req, res, next){
    // Detail error tetap dicatat di sisi server
    console.error("[Error]", err);

    if(err instanceof ResponseError){
        return res.status(err.status).json({
            success: false,
            errors: err.message
        });
    }else if(err instanceof joi.ValidationError) {
        return res.status(400).json({
            success: false, 
            errors: err.message
        });
    }

    // Kesalahan koneksi database (mis. Prisma tidak bisa menjangkau server DB)
    // → kembalikan pesan ramah, jangan bocorkan detail internal/raw error
    const isDbUnreachable =
        err?.code === "P1001" ||
        err?.code === "P1003" ||
        err?.code === "P1012" ||
        err?.code === "P1017" ||
        /can't reach database server/i.test(String(err?.message || "")) ||
        /timed out/i.test(String(err?.message || ""));

    if(isDbUnreachable){
        return res.status(503).json({
            success: false,
            errors: "Gagal terhubung ke database. Silakan coba lagi beberapa saat."
        });
    }

    // Error tak terduga lain → jangan bocorkan isi pesan internal ke klien
    return res.status(500).json({
        success: false,
        errors: "Terjadi kesalahan pada server. Silakan coba lagi."
    });
}