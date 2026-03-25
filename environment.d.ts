declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            PORT: string;
            MONGOURI: string;
        }
    }
}

export {}