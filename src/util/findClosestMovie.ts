import { MovieInterface } from '../enums/Interfaces';

export const normalizeMovieText = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

const compactMovieText = (value: string): string => normalizeMovieText(value).replaceAll(' ', '');

const tokenizeMovieText = (value: string): string[] => normalizeMovieText(value).split(' ').filter(Boolean);

export const findClosestMovie = (movie: string, movies: MovieInterface[]): MovieInterface | null => {
    const normalizedMovie = compactMovieText(movie);
    const queryTokens = new Set(tokenizeMovieText(movie));

    const exactMatch = movies.find(
        (movie_1: MovieInterface) =>
            compactMovieText(movie_1.original_title ?? '') === normalizedMovie ||
            compactMovieText(movie_1.title ?? '') === normalizedMovie
    );

    if (exactMatch) {
        return exactMatch;
    }

    const containingMatches = movies
        .filter((movie_1: MovieInterface) => {
            const normalizedTitle = compactMovieText(movie_1.title ?? '');
            const normalizedOriginalTitle = compactMovieText(movie_1.original_title ?? '');

            return normalizedTitle.includes(normalizedMovie) || normalizedOriginalTitle.includes(normalizedMovie);
        })
        .sort((movieA: MovieInterface, movieB: MovieInterface) => {
            const releaseA = Date.parse(movieA.release_date ?? '') || Number.MAX_SAFE_INTEGER;
            const releaseB = Date.parse(movieB.release_date ?? '') || Number.MAX_SAFE_INTEGER;

            if (releaseA !== releaseB) {
                return releaseA - releaseB;
            }

            return (movieA.title?.length ?? Number.MAX_SAFE_INTEGER) - (movieB.title?.length ?? Number.MAX_SAFE_INTEGER);
        });

    if (containingMatches.length > 0) {
        return containingMatches[0];
    }

    let closestMatch: MovieInterface | null = null;
    let closestTokenScore = -1;
    let closestDistance = Infinity;

    movies.forEach((movie_1: MovieInterface) => {
        const title = movie_1.title ?? movie_1.original_title ?? '';
        const normalizedTitle = compactMovieText(title);
        const titleTokens = new Set(tokenizeMovieText(title));
        const commonTokens = [...queryTokens].filter((token) => titleTokens.has(token)).length;
        const tokenScore = queryTokens.size === 0 ? 0 : commonTokens / queryTokens.size;
        const distance = levenshteinDistance(normalizedMovie, normalizedTitle);

        if (tokenScore > closestTokenScore || (tokenScore === closestTokenScore && distance < closestDistance)) {
            closestTokenScore = tokenScore;
            closestDistance = distance;
            closestMatch = movie_1;
        }
    });

    if (closestMatch && closestTokenScore === 0 && closestDistance > Math.max(normalizedMovie.length, 6)) {
        return null;
    }

    return closestMatch;
};

const levenshteinDistance = (a: string, b: string): number => {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
};
