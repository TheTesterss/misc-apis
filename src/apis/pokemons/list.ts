import { Request, Response } from 'express';
import { ApiCodes, ApiTypes } from '../../enums/enums';
import { ApiInterface, PokemonInterface } from '../../enums/Interfaces';

export default {
    path: '/pokemons',
    type: ApiTypes.GET,
    run: async (req: Request, res: Response) => {
        let pokemons: PokemonInterface[] = require('../../../json/pokemons.json');
        let { type1, type2, gen } = req.query;
        type1 = (type1 as string)?.toUpperCase();
        type2 = (type2 as string)?.toUpperCase();

        if (type1 && type1.toUpperCase()) {
            let found = pokemons.filter(
                (pokemon: PokemonInterface) =>
                    pokemon.types[0].fr === type1 ||
                    pokemon.types[0].en === type1 ||
                    pokemon.types[1]?.fr === type1 ||
                    pokemon.types[1]?.en === type1
            );
            if (found.length > 0) pokemons = found;
        }

        if (type2 && type2.toUpperCase() && type2 !== "NONE") {
            let found = pokemons.filter(
                (pokemon: PokemonInterface) =>
                    pokemon.types[0].fr === type2 ||
                    pokemon.types[0].en === type2 ||
                    pokemon.types[1]?.fr === type2 ||
                    pokemon.types[1]?.en === type2
            );
            if (found.length > 0) pokemons = found;
        } else if(type2 && type2.toUpperCase() && type2 === "NONE") {
            let found = pokemons.filter(
                (pokemon: PokemonInterface) => 
                    pokemon.types.length === 1
            )
            if(found.length > 0) pokemons = found;
        }

        if(gen) {
            let found = pokemons.filter(
                (pokemon: PokemonInterface) =>
                    generationalizePokemon(pokemon) === gen
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
    const index = Number(pokemon.index);

    if (index >= 1 && index <= 151) {
        return "1";
    } else if (index >= 152 && index <= 251) {
        return "2";
    } else if (index >= 252 && index <= 386) {
        return "3";
    } else if (index >= 387 && index <= 493) {
        return "4";
    } else if (index >= 494 && index <= 649) {
        return "5";
    } else if (index >= 650 && index <= 721) {
        return "6";
    } else if (index >= 722 && index <= 809) {
        return "7";
    } else if (index >= 810 && index <= 898) {
        return "8";
    } else if (index >= 899 && index <= 1025) {
        return "9";
    } else {
        return "0";
    }
}