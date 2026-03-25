import { Request, Response } from 'express';
import { ApiCodes, ApiTypes } from '../../enums/enums';
import { ApiInterface, PokemonInterface } from '../../enums/Interfaces';
import { loadPokemons } from '../../util/loadCsvDatasets';

export default {
    path: '/pokemons',
    type: ApiTypes.GET,
    run: async (req: Request, res: Response) => {
        let pokemons: PokemonInterface[] = loadPokemons();
        let { type1, type2, gen } = req.query;
        type1 = (type1 as string)?.toUpperCase();
        type2 = (type2 as string)?.toUpperCase();

        if (type1 && type1.toUpperCase()) {
            let found = pokemons.filter(
                (pokemon: PokemonInterface) =>
                    pokemon.type1fr.toUpperCase() === type1 ||
                    pokemon.type1.toUpperCase() === type1 ||
                    pokemon['type2fr/none']?.toUpperCase() === type1 ||
                    pokemon['type2/none']?.toUpperCase() === type1
            );
            if (found.length > 0) pokemons = found;
        }

        if (type2 && type2.toUpperCase() && type2 !== "NONE") {
            let found = pokemons.filter(
                (pokemon: PokemonInterface) =>
                    pokemon.type1fr.toUpperCase() === type2 ||
                    pokemon.type1.toUpperCase() === type2 ||
                    pokemon['type2fr/none']?.toUpperCase() === type2 ||
                    pokemon['type2/none']?.toUpperCase() === type2
            );
            if (found.length > 0) pokemons = found;
        } else if(type2 && type2.toUpperCase() && type2 === "NONE") {
            let found = pokemons.filter(
                (pokemon: PokemonInterface) => 
                    !pokemon['type2/none']
            )
            if(found.length > 0) pokemons = found;
        }

        if(gen) {
            let found = pokemons.filter(
                (pokemon: PokemonInterface) =>
                    generationalizePokemon(pokemon) === String(gen)
            )
            if(found.length > 0) pokemons = found;
        }

        try {
            return res.status(ApiCodes.SUCCESS).send({
                status: ApiCodes.SUCCESS,
                datas: {
                    amount: pokemons.length,
                    pokemons
                },
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

function generationalizePokemon(pokemon: PokemonInterface): string {
    return String(pokemon.generation ?? 0);
}
