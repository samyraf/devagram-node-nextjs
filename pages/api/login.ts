import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const { login, password } = req.body;

        if (login === "dev@admin.com" && password === "admin123") {
            res.status(200).json({
                mesage: "Usuário autenticado com SUCESSO!",
            }); // 200: OK
        }
        return res.status(400).json({ error: "Usuário ou Senha INCORRETOS!" }); // 400: Bad request
    }
    return res
        .status(405)
        .json({ erro: "Método informado --- não é válido ---!" }); // 405: Method not allowed
};
