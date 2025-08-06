export type LoginForm = {
    email: string;
    password: string;
}

export type RegisterForm = {
    name: string;
    lastname: string;
    email: string;
    password: string;
}

export type AlignType = 'start' | 'center' | 'end';
export type RadiusType = 'none' | 'sm' | 'md' | 'lg';
export type ShadowType = 'none' | 'sm' | 'md' | 'lg';

export type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean | undefined };

export type UserType = {
    id: string;
    email: string;
    role: number;
    token: string;
}
