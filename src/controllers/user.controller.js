import authService from "../services/auth.service.js";

async function userRegister(req, res, next) {
    try {
        const request = req.body;
        const result = await authService.register(request);
        return res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

async function getAllAdmin(req, res, next) {
    try {
        const result = await authService.getAllAdmin();
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}

async function getUserById(req, res, next) {
    try {
        const userId = parseInt(req.params.id);
        const result = await authService.getById(userId);
        res.status(200).json({
            success: true, 
            data: result
        });
    } catch (error) {
        next(error);
    }   
}

async function updateUser(req, res, next) {
    try {
        const userId = parseInt(req.params.id); 
        const updateData = req.body;
        const result = await authService.update(userId, updateData);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}   

async function deleteUser(req, res, next) {
    try {
        const userId = parseInt(req.params.id);     
        await authService.remove(userId);
        res.status(200).json({
            success: true,
            message: "User berhasil dihapus."
        });
    } catch (error) {
        next(error);
    }
}

// Cookie sesi. Di produksi frontend dan backend berada di domain berbeda dan
// diakses lewat HTTPS, jadi cookie harus Secure dan SameSite=None agar terkirim.
// Di pengembangan lokal yang memakai HTTP, keduanya dilonggarkan lewat
// COOKIE_SECURE=false. Nilai ini juga dipakai saat logout, karena clearCookie
// hanya menghapus cookie bila opsinya sama persis dengan saat dipasang.
function sessionCookieOptions() {
    const secure = process.env.COOKIE_SECURE !== "false";

    // Umur cookie disamakan dengan umur token. Sebelumnya cookie bertahan 10 hari
    // sementara tokennya kedaluwarsa dalam 1 hari, sehingga pengguna menyimpan
    // cookie yang sudah tidak berlaku selama sembilan hari berikutnya.
    const maxAge = Number(process.env.COOKIE_MAX_AGE_MS || 24 * 60 * 60 * 1000);

    return {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        maxAge
    };
}

async function userLogin(req, res, next) {
    try {
        const request = req.body;
        const result = await authService.login(request);
        res.cookie("accessToken", result.token, sessionCookieOptions());

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
}



async function userLogout(req, res, next) {
    try {
        const { maxAge, ...clearOptions } = sessionCookieOptions();
        res.clearCookie("accessToken", clearOptions);

        return res.status(200).json({
            success: true,
            message: "Berhasil."
        })
    } catch (error) {
        next(error);
    }
}

export default {
    userRegister,
    getAllAdmin,
    getUserById,
    updateUser,
    deleteUser,
    userLogin,
    userLogout
};