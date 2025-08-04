"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.passwdRecovery = void 0;
const prisma_1 = require("../lib/prisma");
const crypto_1 = require("crypto");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passwdRecovery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }
    try {
        const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
        const tokenExist = yield prisma_1.prisma.passwordResetToken.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const token = (0, crypto_1.randomBytes)(32).toString("hex");
        if (tokenExist) {
            yield prisma_1.prisma.passwordResetToken.update({
                where: { email },
                data: { token }
            });
        }
        else {
            yield prisma_1.prisma.passwordResetToken.create({
                data: { email,
                    token,
                    expires: new Date(Date.now() + 3600000),
                    userId: user.id
                }
            });
        }
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.IP_SERVER,
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const mailOptions = {
            from: `Webmaster <${process.env.EMAIL}>`,
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: `Recuperação de Password`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
                    
                    body {
                        font-family: 'Poppins', Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f7f7f7;
                        color: #333;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 600px;
                        background: #ffffff;
                        margin: 20px auto;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                        border: 1px solid #eaeaea;
                    }
                    .header {
                        background: #162F08;
                        padding: 30px 20px;
                        text-align: center;
                        color: white;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: 600;
                        margin-bottom: 10px;
                        letter-spacing: 1px;
                    }
                    .content {
                        padding: 30px;
                    }
                    .greeting {
                        font-size: 18px;
                        margin-bottom: 20px;
                        color: #444;
                    }
                    .message {
                        margin-bottom: 25px;
                        color: #555;
                    }
                    .credentials {
                        background: #f8f8f8;
                        padding: 15px;
                        border-radius: 6px;
                        margin: 20px 0;
                        border-left: 4px solid #000000;
                    }
                    .credentials p {
                        margin: 8px 0;
                    }
                    .button {
                        display: inline-block;
                        background: #162F08;
                        color: white !important;
                        padding: 12px 25px;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: 500;
                        margin: 15px 0;
                        text-align: center;
                        transition: all 0.3s ease;
                    }
                    .button:hover {
                        background: #333333;
                        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        background: #f8f8f8;
                        color: #666;
                        font-size: 14px;
                        border-top: 1px solid #eaeaea;
                    }
                    .social-icon {
                        width: 20px;
                        height: 20px;
                        margin: 0 5px;
                        vertical-align: middle;
                        transition: all 0.3s ease;
                    }
                    .social-icon:hover {
                        opacity: 0.8;
                    }
                    .contact-info {
                        margin-top: 15px;
                        line-height: 1.8;
                    }
                    .contact-info a {
                        color: #000000;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    .signature {
                        margin-top: 25px;
                        color: #444;
                    }
                    .highlight {
                        color: #000000;
                        font-weight: 500;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="logo">Webmaster</div>
                        <h2 style="margin: 10px 0 0; font-weight: 500;">Pedido de Alteração de Password</h2>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">Dear ${user === null || user === void 0 ? void 0 : user.name} ${user === null || user === void 0 ? void 0 : user.lastname},</div>
                        
                        <div class="message">
                            <p>Você solicitou a recuperação da sua password,</p>
                            
                            <p>Para continuar, clique no botão abaixo.</p>
                        </div>
                        
                        <p style="text-align: center;">
                            <a href='${process.env.APP_URL}/reset-password?token=${token}' class="button">Atualizar a sua password</a>
                        </p>
                        
                        <div class="signature">
                            <p>Com os melhores cumprimentos,</p>
                            <p><strong>A Equipa Webmaster</strong></p>
                        </div>
                    </div>

                </div>
            </body>
            </html>
        `,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.passwdRecovery = passwdRecovery;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        const resetToken = yield prisma_1.prisma.passwordResetToken.findUnique({
            where: { token }
        });
        if (!resetToken) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }
        if (resetToken.expires < new Date()) {
            yield prisma_1.prisma.passwordResetToken.delete({ where: { token } });
            res.status(401).json({ message: 'Token has expired' });
            return;
        }
        const user = yield prisma_1.prisma.user.findUnique({ where: { id: resetToken.userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });
        yield prisma_1.prisma.passwordResetToken.delete({ where: { token } });
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' + error });
    }
});
exports.resetPassword = resetPassword;
