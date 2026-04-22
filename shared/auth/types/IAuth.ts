export interface ILoginResponse {
    token:          string;
    email:          string;
    nombreCompleto: string;
    fotoUrl:        string | null;
    expiresAt:      string;
}

export interface IUserData extends ILoginResponse {
    rol: string; //? Aquí se guarda el rol extraído del JWT
}