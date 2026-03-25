import fs from 'node:fs';
import { parse } from 'csv-parse';
import path from 'path';

const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const records = [];
        fs.createReadStream(filePath)
        .pipe(parse({ columns: true, delimiter: ',', relax_column_count: true }))
        .on('data', (row) => {
            records.push(row);
        })
        .on('end', () => {
            resolve(records);
        })
        .on('error', (err) => {
            reject(err);
        });
    });
};

const convertType = (movie) => {
    return {
        ...movie,
        id: parseInt(movie.id, 10),
        budget: parseFloat(movie.budget),
        popularity: parseFloat(movie.popularity),
        revenue: parseFloat(movie.revenue),
        runtime: movie.runtime ? parseFloat(movie.runtime) : null,
        vote_average: parseFloat(movie.vote_average),
        vote_count: parseInt(movie.vote_count, 10),
        adult: movie.adult === 'True',
    };
}

const mergeData = async () => {
    try {
        const credits = await readCSV('csv/movies/credits.csv');
        const keywords = await readCSV('csv/movies/keywords.csv');
        const moviesMetadata = await readCSV('csv/movies/movies_metadata.csv');
        const ratings = await readCSV('csv/movies/ratings.csv');

        const movies = {};

        moviesMetadata.forEach((movie) => {
            if (parseFloat(movie.revenue) > 10_000_000) {
                const { homepage, poster_path, ...filteredMovie } = movie;
                movies[movie.id] = { ...convertType(filteredMovie), cast: [], crew: [], keywords: [], ratings: [] };
            }
        });

        credits.forEach((credit) => {
            if (movies[credit.id]) {
                movies[credit.id].cast.push(credit.cast);
                movies[credit.id].crew.push(credit.crew);
            }
        });

        keywords.forEach((keyword) => {
            if (movies[keyword.id]) {
                movies[keyword.id].keywords.push(keyword.keywords);
            }
        });

        ratings.forEach((rating) => {
            if (movies[rating.movieId]) {
                movies[rating.movieId].ratings.push(rating);
            }
        });

        const outputFilePath = 'src/util/json/movies.json'
        const writeStream = fs.createWriteStream(outputFilePath);
        writeStream.write('[');

        const movieIds = Object.keys(movies);
        movieIds.forEach((id, index) => {
            const movieData = JSON.stringify(movies[id]);
            writeStream.write(movieData);
            if (index < movieIds.length - 1) {
                writeStream.write(',');
            }
        });

        writeStream.write(']');
        writeStream.end();

        console.log('Data successfully written to movies.json');
    } catch (error) {
        console.error('Error processing CSV files:', error);
    }
};

mergeData();