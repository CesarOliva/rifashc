import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { loginAdmin } from "../services/api";
import { setAdminToken } from "../services/auth";

const AdminLoginPage = () => {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/Admin";

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await loginAdmin(usuario, password);
            if (!data?.success || !data?.token) {
                toast.error(data?.message || "Credenciales invalidas");
                return;
            }

            setAdminToken(data.token);
            toast.success("Sesion iniciada");
            navigate(from, { replace: true });
        } catch (err: any) {
            toast.error(err?.message || "Error al iniciar sesion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full flex items-center justify-center my-12 px-6">
            <div className="w-full max-w-md bg-neutral-900/70 border border-neutral-700 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-2">Acceso Admin</h2>
                <p className="text-neutral-300 mb-6">Ingresa tus credenciales para continuar.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        className="w-full rounded-lg bg-neutral-800 text-white px-4 py-3 focus:outline-none border border-neutral-700 focus:border-neutral-400"
                    />
                    <input
                        type="password"
                        placeholder="Contrasena"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg bg-neutral-800 text-white px-4 py-3 focus:outline-none border border-neutral-700 focus:border-neutral-400"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#f6d061] hover:bg-[#f5c946] font-semibold text-black h-12 rounded-lg transition-colors duration-300 disabled:opacity-60"
                    >
                        {loading ? "Validando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AdminLoginPage;
