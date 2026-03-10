import { Request, Response } from "express";
import db from "../database";

export const login = async (req: Request, res: Response) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        const query = `
            SELECT id, email, nome, tipo_usuario_id
            FROM usuario
            WHERE email = $1 AND senha = $2
        `;

        const result = await db.query(query, [email, password]);

        if (result.rowCount && result.rowCount > 0) {
            return res.json({ success: true, user: result.rows[0] });
        }

        return res.status(401).json({ success: false, message: "Falha no login" });

    } catch (err: any) {
        console.error("Erro no login:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const novoLogin = async (req: Request, res: Response) => {

    try {

        const { email, password, nome } = req.body;

        if (!email || !password || !nome) {
            return res.status(400).json({ message: "Dados incompletos" });
        }

        const nomeNormalizado = normalizarNome(nome);

        const queryNomeExiste = `
            SELECT * FROM iptu
            WHERE nome = $1
        `;

        const iptuResult = await db.query(queryNomeExiste, [nomeNormalizado]);

        if (!iptuResult.rowCount) {
            return res.status(404).json({
                success: false,
                message: `Nome '${nome}' não encontrado no cadastro de munícipes`
            });
        }

        const insertUsuario = `
            INSERT INTO usuario (email, senha, nome, tipo_usuario_id)
            VALUES ($1, $2, $3, 3)
            RETURNING id
        `;

        const usuarioCriado = await db.query(insertUsuario, [email, password, nome]);

        const usuarioId = usuarioCriado.rows[0].id;

        const updateIptu = `
            UPDATE iptu
            SET usuario_id = $1
            WHERE nome = $2
        `;

        await db.query(updateIptu, [usuarioId, nomeNormalizado]);

        res.json({
            success: true,
            user: {
                id: usuarioId,
                email,
                nome
            }
        });

    } catch (err: any) {
        console.error("Erro ao criar usuário:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const atualizarIptu = async (req: Request, res: Response) => {

    try {

        const { usuarioId, novoValor } = req.body;

        if (!usuarioId || novoValor === undefined) {
            return res.status(400).json({ error: "Dados inválidos" });
        }

        const query = `
            UPDATE iptu
            SET valor = $1
            WHERE usuario_id = $2
        `;

        await db.query(query, [novoValor, usuarioId]);

        res.json({ message: "IPTU atualizado com sucesso" });

    } catch (err: any) {
        console.error("Erro ao atualizar IPTU:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getIptuPorIdUsuario = async (req: Request, res: Response) => {

    try {

        const usuarioId = req.query.usuarioId as string;

        if (!usuarioId) {
            return res.status(400).json({ error: "usuarioId é obrigatório" });
        }

        const query = `
            SELECT *
            FROM iptu
            WHERE usuario_id = $1
        `;

        const result = await db.query(query, [usuarioId]);

        res.json({ iptu: result.rows });

    } catch (err: any) {
        console.error("Erro ao buscar IPTU:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

export const getQRCodeOrCodBarras = async (req: Request, res: Response) => {

    const tipo = req.query.tipo as string;

    let codigoHtml = "";

    if (tipo === "codigoDeBarras") {

        codigoHtml =
            `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=123456789" />`;

    } else if (tipo === "qrcode") {

        codigoHtml =
            `<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QRCodeDemo" />`;
    }

    res.send(`
        <h2>Tipo selecionado: ${tipo}</h2>
        ${codigoHtml}
    `);
};

export function normalizarNome(nome: string): string {

    return nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}