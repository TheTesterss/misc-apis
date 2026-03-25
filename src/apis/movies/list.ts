import { Request, Response } from 'express';
import { ApiCodes, ApiTypes } from '../../enums/enums';
import { ApiInterface, MovieInterface } from '../../enums/Interfaces';
import { loadMovies } from '../../util/loadCsvDatasets';
import { normalizeMovieText } from '../../util/findClosestMovie';
import { sanitizeMovie } from '../../util/sanitizeMovie';

export default {
    path: '/movies',
    type: ApiTypes.GET,
    run: async (req: Request, res: Response) => {
        let movies: MovieInterface[] = loadMovies();
        const title = typeof req.query.title === 'string' ? req.query.title : '';
        const director = typeof req.query.director === 'string' ? req.query.director : '';
        const language = typeof req.query.language === 'string' ? req.query.language.toLowerCase() : '';
        const minRevenue = Number(req.query.minRevenue);
        const maxRevenue = Number(req.query.maxRevenue);
        const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'revenue';
        const order = req.query.order === 'asc' ? 1 : -1;
        const requestedLimit = Number(req.query.limit);
        const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 1000) : 1000;

        if (title.trim()) {
            const normalizedTitle = normalizeMovieText(title);
            movies = movies.filter((movie: MovieInterface) =>
                normalizeMovieText(`${movie.title} ${movie.original_title}`).includes(normalizedTitle)
            );
        }

        if (director.trim()) {
            const normalizedDirector = normalizeMovieText(director);
            movies = movies.filter((movie: MovieInterface) =>
                normalizeMovieText(movie.director ?? '').includes(normalizedDirector)
            );
        }

        if (language.trim()) {
            movies = movies.filter((movie: MovieInterface) => movie.original_language?.toLowerCase() === language);
        }

        if (Number.isFinite(minRevenue)) {
            movies = movies.filter((movie: MovieInterface) => movie.revenue >= minRevenue);
        }

        if (Number.isFinite(maxRevenue)) {
            movies = movies.filter((movie: MovieInterface) => movie.revenue <= maxRevenue);
        }

        const sortResolvers: Record<string, (movie: MovieInterface) => number> = {
            revenue: (movie: MovieInterface) => movie.revenue,
            popularity: (movie: MovieInterface) => movie.popularity,
            vote_average: (movie: MovieInterface) => movie.vote_average
        };
        const sortResolver = sortResolvers[sortBy] ?? sortResolvers.revenue;

        try {
            return res.status(ApiCodes.SUCCESS).send({
                status: ApiCodes.SUCCESS,
                datas: {
                    amount: movies.length,
                    queries: {
                        title: 'string',
                        director: 'string',
                        language: 'string',
                        minRevenue: 'number',
                        maxRevenue: 'number',
                        sortBy: '"revenue" | "popularity" | "vote_average"',
                        order: '"asc" | "desc"',
                        limit: 'number (1-1000)'
                    },
                    movies: movies
                        .sort((a: MovieInterface, b: MovieInterface) => (sortResolver(a) - sortResolver(b)) * order)
                        .slice(0, limit)
                        .map((movie: MovieInterface) => sanitizeMovie(movie))
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
