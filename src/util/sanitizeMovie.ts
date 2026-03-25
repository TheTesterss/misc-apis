import { MovieInterface } from '../enums/Interfaces';

export const sanitizeMovie = (movie: MovieInterface) => {
    const { crew, ...sanitizedMovie } = movie;
    return sanitizedMovie;
};
