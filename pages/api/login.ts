import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { LoginResposta } from "@/types/LoginResposta";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import md5 from "md5";
import jwt from "jsonwebtoken";

const endpointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {
    const { MINHA_CHAVE_JWT } = process.env;

    if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ error: ".env JWT NÃO INFORMADO!" }); // 500: Internal Server Error
    }

    if (req.method === "POST") {
        const { login, password } = req.body;

        const usuariosEncontrados = await UsuarioModel.find({
            email: login,
            senha: md5(password),
        });

        if (usuariosEncontrados && usuariosEncontrados.length > 0) {
            const usuarioLogado = usuariosEncontrados[0];

            const token = jwt.sign({ _id: usuarioLogado._id }, MINHA_CHAVE_JWT);

            return res.status(200).json({
                nome: usuarioLogado.nome,
                email: usuarioLogado.email,
                token,
            }); // 200: OK
        }
        return res.status(400).json({ error: "Usuário ou Senha INCORRETOS!" }); // 400: Bad request
    }
    return res
        .status(405)
        .json({ error: "Método informado --- NÃO É VÁLIDO ---!" }); // 405: Method not allowed
};

export default conectarMongoDB(endpointLogin);
