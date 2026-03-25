export enum ApiTypes {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    PUT = 'put',
    DELETE = 'delete'
}

export enum ApiCodes {
    SUCCESS = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    MOVED = 301,
    BAD_REQUEST = 400,
    AUTH_REQUIRED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL = 500,
    BAD_GATEWAY = 502,
    NOT_AVAILABLE = 503
}

export enum DiscordUrls {
    USER = 'https://discord.com/api/v10/users/'
}

export enum DiscordFlags {
    STAFF = 'Staff',
    PARTNER = 'Partner',
    BUG_HUNTER_1 = 'Bug hunter 1',
    BUG_HUNTER_2 = 'Bug hunter 2',
    HYPESQUAD = 'Hypesquad',
    HYPESQUAD_HOUSE_1 = 'Hypesquad Bravery',
    HYPESQUAD_HOUSE_2 = 'Hypesquad Brilliance',
    HYPESQUAD_HOUSE_3 = 'Hypesquad Balance',
    ACTIVE_DEVELOPER = 'Active Developer',
    VERIFIED_DEVELOPER = 'Verified Developer',
    VERIFIED_BOT = 'Verified Bot',
    CERTIFIED_MODERATOR = 'Certified Moderator',
    HTTP_INTERACTIONS = 'Bot HTTP Interaction',
    EARLY_SUPPORTER = 'Early Supporter',
    TEAM = 'Team'
}
