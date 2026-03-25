import { Request, Response } from 'express';
import { ApiCodes, ApiTypes } from '../../enums/enums';
import { ApiInterface, PokemonInterface } from '../../enums/Interfaces';
import { loadPokemons } from '../../util/loadCsvDatasets';

export default {
    path: '/pokemons/:pokemon',
    type: ApiTypes.GET,
    run: async (req: Request, res: Response) => {
        const pokemons: PokemonInterface[] = loadPokemons();
        let { pokemon } = req.params;
        pokemon = pokemon.toLowerCase();

        if (
            !pokemon ||
            (pokemon &&
                !pokemons.some(
                    (poke: PokemonInterface) =>
                        poke.namefr.toLowerCase() === pokemon || poke.name.toLowerCase() === pokemon
                ))
        ) {
            return res.status(ApiCodes.BAD_REQUEST).send({
                status: ApiCodes.BAD_REQUEST,
                datas: {},
                message:
                    "You're pokemon could not be found. Verify the name and remember that we only give datas for pokemons from the first generation to the seventh one."
            });
        }

        try {
            return res.status(ApiCodes.SUCCESS).send({
                status: ApiCodes.SUCCESS,
                datas: pokemons.find(
                    (poke: PokemonInterface) =>
                        poke.namefr.toLowerCase() === pokemon || poke.name.toLowerCase() === pokemon
                ),
                message: 'Success.'
            });
        } catch (error) {
            console.log(error);
            return res.status(ApiCodes.BAD_GATEWAY).send({
                status: ApiCodes.BAD_GATEWAY,
                datas: error,
                message: 'An error occured while requesting to our datas.'
            });
        }
    }
} as ApiInterface;
