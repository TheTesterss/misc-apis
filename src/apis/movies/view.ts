import { Request, Response } from 'express';
import { ApiCodes, ApiTypes } from '../../enums/enums';
import { ApiInterface, MovieInterface } from '../../enums/Interfaces';
import { findClosestMovie } from '../../util/findClosestMovie';
import { loadMovies } from '../../util/loadCsvDatasets';
import { sanitizeMovie } from '../../util/sanitizeMovie';

export default {
    path: '/movies/:movie',
    type: ApiTypes.GET,
    run: async (req: Request, res: Response) => {
        const movies: MovieInterface[] = loadMovies();
        let { movie } = req.params;
        movie = movie.toLowerCase();

        const closest: MovieInterface | null = findClosestMovie(movie, movies);
        if (
            !closest
        ) {
            return res.status(ApiCodes.BAD_REQUEST).send({
                status: ApiCodes.BAD_REQUEST,
                datas: {},
                message:
                    "You're movie could not be found. Verify the name and remember that we only give datas for movies with over ten million entries."
            });
        }

        try {
            return res.status(ApiCodes.SUCCESS).send({
                status: ApiCodes.SUCCESS,
                datas: sanitizeMovie(closest),
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

