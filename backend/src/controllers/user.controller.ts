import { RequestHandler } from 'express';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const user: RequestHandler = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string,
            email: string,
            role: string
        };
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
                lastname: true,
                createdAt: true,
                updatedAt: true,
                role: true,
            }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Token inválido o expirado' });
            return;
        }

        res.status(500).json({ message: 'Error del servidor' });
    }
}

export const registerUser: RequestHandler = async (req, res) => {
    try {
        const { name, email, password, lastname } = req.body;
        if (!name || !email || !password || !lastname) {
            res.status(400).json({ message: 'Todos os campos são obrigatórios' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                lastname,
                role: 1
            }
        });
        res.status(201).json({ message: 'Utilizador criado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
}


