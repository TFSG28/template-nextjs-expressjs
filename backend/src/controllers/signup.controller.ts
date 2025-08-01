import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

export const newUser = async (req: Request, res: Response) => {
    try {
        const { email, password, name, lastname, role } = req.body;
        if (!email || !password || !name || !lastname || !role) {
            res.status(404).json({ message: 'Mandatory fields are missing', });
        }
        const hashedPass = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email, name, lastname, role, password: hashedPass
            }
        })
        res.status(201).json({ message: 'User Created Successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};