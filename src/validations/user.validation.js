import joi from "joi";

// Akun di sini memegang data gaji seluruh karyawan, jadi kata sandinya dituntut
// lebih dari sekadar panjang: minimal 10 karakter dengan huruf besar, huruf kecil,
// dan angka. Batas 6 karakter sebelumnya bisa ditebak dalam hitungan menit.
const strongPassword = joi.string()
    .min(10)
    .max(100)
    .pattern(/[a-z]/, "huruf kecil")
    .pattern(/[A-Z]/, "huruf besar")
    .pattern(/[0-9]/, "angka")
    .required()
    .messages({
        "string.min": "Kata sandi minimal 10 karakter.",
        "string.pattern.name": "Kata sandi harus memuat {#name}."
    });

const registerValidation = joi.object({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().email().min(3).max(100).required(),
    password: strongPassword,
    role: joi.string()
    .valid("HR_ADMIN")
    .default("HR_ADMIN")
});

// Login sengaja tidak memakai aturan kekuatan kata sandi. Menolak lebih awal di
// sini akan membocorkan aturan yang dipakai akun lama kepada penebak.
const loginValidation = joi.object({
    email: joi.string().email().min(3).max(100).required(),
    password: joi.string().min(1).max(100).required()
});

const getAllAdminValidation = joi.object({
    page: joi.number().positive().default(1),
    limit: joi.number().positive().max(100).default(10)
});

const updateUserValidation = joi.object({
    username: joi.string().min(3).max(30).optional(),
    email: joi.string().email().min(3).max(100).optional()
});

const deleteUserValidation = joi.number().positive();

//untuk memvalidasi hanya user yang sedang login yang boleh masuk.
const getUserValidate = joi.number().positive();

export { registerValidation, loginValidation, getAllAdminValidation, updateUserValidation, deleteUserValidation, getUserValidate };
