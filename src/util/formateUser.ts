import { DiscordFlags } from '../enums/enums';
import { DiscordUser, DiscordFormatedUser } from '../enums/Interfaces';

export default function formateUser(d: DiscordUser): DiscordFormatedUser {
    const userFlags = [
        { name: DiscordFlags.STAFF, value: BigInt(1 << 0) },
        { name: DiscordFlags.PARTNER, value: BigInt(1 << 1) },
        { name: DiscordFlags.HYPESQUAD, value: BigInt(1 << 2) },
        { name: DiscordFlags.BUG_HUNTER_1, value: BigInt(1 << 3) },
        { name: DiscordFlags.HYPESQUAD_HOUSE_1, value: BigInt(1 << 6) },
        { name: DiscordFlags.HYPESQUAD_HOUSE_2, value: BigInt(1 << 7) },
        { name: DiscordFlags.HYPESQUAD_HOUSE_3, value: BigInt(1 << 8) },
        { name: DiscordFlags.EARLY_SUPPORTER, value: BigInt(1 << 9) },
        { name: DiscordFlags.TEAM, value: BigInt(1 << 10) },
        { name: DiscordFlags.BUG_HUNTER_2, value: BigInt(1 << 14) },
        { name: DiscordFlags.VERIFIED_BOT, value: BigInt(1 << 16) },
        { name: DiscordFlags.VERIFIED_DEVELOPER, value: BigInt(1 << 17) },
        { name: DiscordFlags.CERTIFIED_MODERATOR, value: BigInt(1 << 18) },
        { name: DiscordFlags.HTTP_INTERACTIONS, value: BigInt(1 << 19) },
        { name: DiscordFlags.ACTIVE_DEVELOPER, value: BigInt(1 << 22) }
    ];

    const getBadges = (flags = d.flags, badges: { name: string; value: bigint }[]): string[] => {
        return badges.filter((badge) => (BigInt(flags) & badge.value) === badge.value).map((badge) => badge.name);
    };
    const matchedBadges = getBadges(d.flags, userFlags);
    const getExtension = (asset: string): 'gif' | 'png' => {
        return asset.startsWith('a_') ? 'gif' : 'png';
    };

    return {
        id: d.id,
        username: d.username,
        global_name: d.global_name,
        discriminator: d.discriminator,
        flags:
            d.flags === BigInt(0)
                ? {
                      current: d.flags,
                      public: d.public_flags,
                      list: matchedBadges
                  }
                : null,
        banner: d.banner
            ? {
                  accent_color: d.accent_color ?? null,
                  asset: d.banner,
                  animated: d.banner?.startsWith('a_') ?? false,
                  url: `https://cdn.discordapp.com/banners/${d.id}/${d.banner}.${getExtension(d.banner)}`
              }
            : null,
        banner_color: d.banner_color ?? '#000000',
        avatar: d.avatar
            ? {
                  asset: d.avatar,
                  animated: d.avatar?.startsWith('a_') ?? false,
                  url: `https://cdn.discordapp.com/banners/${d.id}/${d.avatar}.${getExtension(d.avatar)}`
              }
            : null,
        avatarDecoration: d.avatar_decoration_data
            ? {
                  asset: d.avatar_decoration_data.asset,
                  expires_at: d.avatar_decoration_data.expires_at,
                  sku_id: d.avatar_decoration_data.sku_id,
                  url: `https://cdn.discordapp.com/avatar-decoration-presets/${d.avatar_decoration_data.asset}.${getExtension(d.avatar_decoration_data.asset)}`
              }
            : null,
        clan: d.clan ?? null,
        bot: d.bot ?? false,
        system: d.system ?? false,
        mfa_enabled: d.mfa_enabled ?? false,
        locale: d.locale ?? null,
        email: d.email ?? null,
        verified: d.verified ?? false,
        premium_type: d.premium_type ?? null
    };
}
