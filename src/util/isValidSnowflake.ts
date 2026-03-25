import { SnowflakeUtil } from 'discord.js';

export default function isValidSnowflake(id: string) {
    try {
        return SnowflakeUtil.deconstruct(id) !== null;
    } catch (e) {
        return false;
    }
}
