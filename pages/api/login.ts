import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";

const endpointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if (req.method === "POST") {
        const { login, password } = req.body;

        if (login === "dev@admin.com" && password === "admin123") {
            return res.status(200).json({
                message: "Usuário autenticado com SUCESSO!",
            }); // 200: OK
        }
        return res.status(400).json({ error: "Usuário ou Senha INCORRETOS!" }); // 400: Bad request
    }
    return res
        .status(405)
        .json({ error: "Método informado --- NÃO É VÁLIDO ---!" }); // 405: Method not allowed
};

export default conectarMongoDB(endpointLogin);
