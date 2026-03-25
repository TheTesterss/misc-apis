export type ApisConfigType = {
    port: number;
    messages: MessagesType[];
    subConfigs: ApisSubConfigType[];
};

export type ApisSubConfigType = {
    key: string;
    value: any;
};

export type MessagesType = {
    ListenersMessage: string;
    errorInitializating: string;
    initializatingFinished: string;
};

export type DiscordUserFlags =
    | 'Partner'
    | 'Hypesquad Bravery'
    | 'Hypesquad Brilliance'
    | 'Hypesquad Balance'
    | 'Hypesquad'
    | 'Verified Bot'
    | 'Verified Developer'
    | 'Certified Moderator'
    | 'Staff'
    | 'Active Developer'
    | 'Early Supporter'
    | 'Bug hunter 1'
    | 'Bug hunter 2'
    | 'Bot HTTP Interaction'
    | 'Team';
