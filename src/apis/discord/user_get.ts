import { Request, Response } from 'express';
import { ApiCodes, ApiTypes, DiscordUrls } from '../../enums/enums';
import { ApiInterface } from '../../enums/Interfaces';
import isValidSnowflake from '../../util/isValidSnowflake';
import axios from 'axios';
import formateUser from '../../util/formateUser';

export default {
    path: '/discord/users/:user_id',
    type: ApiTypes.GET,
    run: async (req: Request, res: Response) => {
        let { user_id } = req.params;
        user_id = user_id as string;

        if (!user_id || (user_id && !isValidSnowflake(user_id))) {
            return res.status(ApiCodes.BAD_REQUEST).send({
                status: ApiCodes.BAD_REQUEST,
                datas: {},
                message: 'You might put a correct user id.'
            });
        }

        try {
            let response = await axios.get(`${DiscordUrls.USER}/${user_id}`, {
                headers: {
                    Authorization: `Bot ${process.env.TOKEN}`
                }
            });

            return res.status(ApiCodes.SUCCESS).send({
                status: ApiCodes.SUCCESS,
                datas: formateUser(response.data),
                message: 'Success.'
            });
        } catch (error) {
            console.log(error);
            return res.status(ApiCodes.BAD_GATEWAY).send({
                status: ApiCodes.BAD_GATEWAY,
                datas: error,
                message: 'An error occured while requesting to the discord api.'
            });
        }
    }
} as ApiInterface;
