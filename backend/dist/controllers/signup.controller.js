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
exports.newUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, lastname, role } = req.body;
        if (!email || !password || !name || !lastname || !role) {
            res.status(404).json({ message: 'Mandatory fields are missing', });
        }
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        yield prisma_1.prisma.user.create({
            data: {
                email, name, lastname, role, password: hashedPass
            }
        });
        res.status(201).json({ message: 'User Created Successfully!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
});
exports.newUser = newUser;
