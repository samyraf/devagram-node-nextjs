import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import mongoose from "mongoose";

// middleware recebe um handler e esse handler recebe uma função
// esse handler já faz a tratativa e depois disso ele chama o endpoint se for necessário
export const conectarMongoDB =
    (handler: NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
        // vericando se o banco já está conectado, se estiver, seguir para o endpoint ou prox middleware
        if (mongoose.connections[0].readyState) {
            return handler(req, res);
        }

        // se não estiver conectado, ele fará a conexão
        // obtendo a variável de ambiente preenchida do .env
        const { DB_CONEXAO_STRING } = process.env;

        // se a env estiver vazia, aborta o uso do sistema e avisa o programador
        if (!DB_CONEXAO_STRING) {
            return res
                .status(500)
                .json({ error: "ENV de config do banco NÃO INFORMADA!" }); // 500: Internal Server Error
        }

        mongoose.connection.on("connected", () =>
            console.log("----- BANCO DE DADOS CONECTADO -----")
        );
        mongoose.connection.on("error", (error) =>
            console.log(
                `----- OCORREU ERRO AO CONECTAR NO BANCO: ${error} -----`
            )
        );
        await mongoose.connect(DB_CONEXAO_STRING);

        // agora posso seguir para o endpoint, pois está conectado no banco
        return handler(req, res);
    };
