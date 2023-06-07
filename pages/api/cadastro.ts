import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import type { CadastroRequisicao } from "@/types/CadastroRequisicao";
import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { UsuarioModel } from "@/models/UsuarioModel";
import md5 from "md5";

const endpointCadastro = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if (req.method === "POST") {
        const usuario = req.body as CadastroRequisicao;

        if (!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({ error: "Nome INVÁLIDO!" }); // 400: Bad request
        }

        if (
            !usuario.email ||
            usuario.email.length < 5 ||
            !usuario.email.includes("@") ||
            !usuario.email.includes(".")
        ) {
            return res.status(400).json({ error: "E-mail INVÁLIDO!" }); // 400: Bad request
        }

        if (!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({ error: "Senha INVÁLIDA!" }); // 400: Bad request
        }

        // Valindando se já existe usuario com o mesmo e-mail
        const usuariosComMesmoEmail = await UsuarioModel.find({
            email: usuario.email,
        });
        if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0) {
            return res
                .status(400)
                .json({ error: "Já existe uma conta com o e-mail informado!" }); // 400: Bad request
        }

        // Salvar no banco de dados
        const usuarioASerSalvo = {
            nome: usuario.nome,
            email: usuario.email,
            senha: md5(usuario.senha),
        };
        await UsuarioModel.create(usuarioASerSalvo);
        return res.status(200).json({
            message: "Usuário cadastrado com SUCESSO!",
        }); // 200: OK
    }
    return res
        .status(405)
        .json({ error: "Método informado --- NÃO É VÁLIDO ---!" }); // 405: Method not allowed
};

export default conectarMongoDB(endpointCadastro);
