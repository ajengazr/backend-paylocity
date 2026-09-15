import { prismaClient } from "./application/db.js";
import { web } from "./application/web.js";
import dotenv from "dotenv";
import argon2 from "argon2";

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;

// Kunci token diperiksa sebelum server menerima permintaan pertama. Tanpa ini
// aplikasi tetap menyala dengan kunci kosong, dan setiap token bisa dipalsukan.
function validateConfig() {
    const secret = process.env.JWT_TOKEN;

    if (!secret) {
        throw new Error("JWT_TOKEN belum diisi. Server dihentikan.");
    }

    if (Buffer.byteLength(secret, "utf8") < 32) {
        throw new Error(
            "JWT_TOKEN kurang dari 32 byte. Gunakan kunci acak, misalnya hasil `openssl rand -base64 48`."
        );
    }
}

// Akun SUPER_ADMIN pertama dibuat hanya bila diminta lewat environment variable,
// dan hanya ketika belum ada SUPER_ADMIN di basis data. Sebelumnya akun ini dibuat
// otomatis tiap startup dengan email dan password yang tertulis di dalam kode,
// sehingga siapa pun yang membaca repositori bisa masuk sebagai admin tertinggi.
async function bootstrapSuperAdmin() {
    if (process.env.BOOTSTRAP_ADMIN_ENABLED !== "true") {
        return;
    }

    const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
    const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
    const username = process.env.BOOTSTRAP_ADMIN_USERNAME || "MANAJER";

    if (!email || !password) {
        throw new Error(
            "BOOTSTRAP_ADMIN_EMAIL dan BOOTSTRAP_ADMIN_PASSWORD wajib diisi saat bootstrap diaktifkan."
        );
    }

    const existing = await prismaClient.user.findFirst({ where: { role: "SUPER_ADMIN" } });

    if (existing) {
        console.log("SUPER_ADMIN sudah ada, bootstrap dilewati.");
        return;
    }

    await prismaClient.user.create({
        data: {
            username,
            email,
            password: await argon2.hash(password),
            role: "SUPER_ADMIN"
        }
    });

    console.log(
        `SUPER_ADMIN dibuat untuk ${email}. Matikan BOOTSTRAP_ADMIN_ENABLED dan hapus passwordnya dari environment.`
    );
}

async function start() {
    try {
        validateConfig();
        await bootstrapSuperAdmin();

        web.listen(PORT, () => {
            console.log(`Server running di PORT ${PORT}`);
        });
    } catch (error) {
        console.error(error.message || error);
        process.exit(1);
    }
}

start();

