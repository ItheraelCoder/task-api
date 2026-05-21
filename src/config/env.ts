import {z} from "zod";

const envSchema = z.object({
    PORT:z.string().default("3000"),
    NODE_ENV:z.enum(["development","production","test"]).default("development"),
    DATABASE_URL:z.url("La url de la base de datos debe ser valida"),
    JWT_SECRET:z.string().min(32,"JWT_SECRET debe contener al menos 32 caracteres"),
    JWT_EXPIRES_IN:z.string().default("15m"),
    JWT_REFRESH_SECRET:z.string().min(32,"JWT_REFRESH_SECRET debe contener al menos 32 caracteres"),
    JWT_REFRESH_EXPIRES_IN:z.string().default("7d"),
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    console.error("❌ Variables de entorno inválidas:");
    console.error(parsed.error.flatten(issue => issue.message).fieldErrors);
    process.exit(1);
}

export const env = parsed.data