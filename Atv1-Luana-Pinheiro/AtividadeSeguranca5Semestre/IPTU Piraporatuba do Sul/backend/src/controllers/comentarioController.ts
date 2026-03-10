import { Request, Response } from "express";
import db from "../database";
import xss from "xss";

export const criarComentario = async (req: Request, res: Response) => {
    try {
        const { texto, usuarioId } = req.body;

        if (!texto || !usuarioId) {
            return res.status(400).json({ error: "Texto e usuarioId são obrigatórios" });
        }

        const textoLimpo = xss(texto.trim());

        const query = `
            INSERT INTO comentario (texto, usuario_id)
            VALUES ($1, $2)
        `;

        await db.query(query, [textoLimpo, usuarioId]);

        res.status(201).json({ message: "Comentário criado com sucesso" });

    } catch (err: any) {
        console.error("Erro ao criar comentário:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const listarComentarios = async (_req: Request, res: Response) => {
    try {

        const query = `SELECT id, texto, usuario_id FROM comentario`;

        const result = await db.query(query);

        res.json(result.rows);

    } catch (err: any) {
        console.error("Erro ao listar comentários:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};