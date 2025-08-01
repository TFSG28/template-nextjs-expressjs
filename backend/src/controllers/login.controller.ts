import { RequestHandler } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Mandatory fields are missing' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            res.status(401).json({ message: 'Incorrect password' });
            return;
        }

        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            lastname: user.lastname,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: user.role,
        };

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(200).json({ message: 'Login successful', token, user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
