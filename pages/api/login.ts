import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import md5 from "md5";

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if (req.method === "POST") {
        const { login, password } = req.body;

        const usuariosEncontrados = await UsuarioModel.find({
            email: login,
            senha: md5(password),
        });

        if (usuariosEncontrados && usuariosEncontrados.length > 0) {
            const usuarioLogado = usuariosEncontrados[0];
            return res.status(200).json({
                message: `Usuário ${usuarioLogado.nome} autenticado com SUCESSO!`,
            }); // 200: OK
        }
        return res.status(400).json({ error: "Usuário ou Senha INCORRETOS!" }); // 400: Bad request
    }
    return res
        .status(405)
        .json({ error: "Método informado --- NÃO É VÁLIDO ---!" }); // 405: Method not allowed
};

export default conectarMongoDB(endpointLogin);
