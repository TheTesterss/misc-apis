import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { MovieInterface, PokemonInterface } from '../enums/Interfaces';

const csvCache = new Map<string, unknown[]>();

const toNullableString = (value: string | undefined): string | null => {
    if (!value) {
        return null;
    }

    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'none' || trimmed.toLowerCase() === 'n/a') {
        return null;
    }

    return trimmed;
};

const toNumber = (value: string | undefined): number | null => {
    if (!value) {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};

const toBoolean = (value: string | undefined): boolean => (value ?? '').trim().toLowerCase() === 'true';

const readCsvFile = <T>(fileName: string, mapper: (row: Record<string, string>) => T): T[] => {
    if (csvCache.has(fileName)) {
        return csvCache.get(fileName) as T[];
    }

    const filePath = path.join(path.resolve(__dirname, '..', '..'), 'csv', fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    const rows = parse(content, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true
    }) as Record<string, string>[];

    const dataset = rows.map(mapper);
    csvCache.set(fileName, dataset);
    return dataset;
};

export const loadPokemons = (): PokemonInterface[] =>
    readCsvFile<PokemonInterface>('pokemons.csv', (row) => ({
        name: row.name,
        namefr: row.namefr,
        type1: row.type1,
        type1fr: row.type1fr,
        'type2/none': toNullableString(row['type2/none']),
        'type2fr/none': toNullableString(row['type2fr/none']),
        generation: toNumber(row.generation) ?? 0,
        index: toNumber(row.index) ?? 0,
        description: row.description,
        descriptionfr: row.descriptionfr,
        'image(link)': row['image(link)'],
        hasMegaEvolution: toBoolean(row.hasMegaEvolution),
        'weight(in kg)': toNumber(row['weight(in kg)']),
        legendary: toBoolean(row.legendary),
        fabulous: toBoolean(row.fabulous),
        'size(in meter)': toNumber(row['size(in meter)']),
        'biomes(where we can found it)': toNullableString(row['biomes(where we can found it)']),
        'evolution-stade': toNumber(row['evolution-stade']),
        color: row.color,
        isMaxEvolution: toBoolean(row.isMaxEvolution),
        hasBeenInAshTeam: toBoolean(row.hasBeenInAshTeam),
        hasGenderDifference: toBoolean(row.hasGenderDifference),
        isFormSwitchable: toBoolean(row.isFormSwitchable),
        baseHappiness: toNumber(row.baseHappiness),
        captureRate: toNumber(row.captureRate)
    }));

export const loadMovies = (): MovieInterface[] =>
    readCsvFile<MovieInterface>('movies.csv', (row) => ({
        index: toNumber(row.index) ?? 0,
        budget: toNumber(row.budget) ?? 0,
        genres: row.genres,
        homepage: toNullableString(row.homepage),
        id: toNumber(row.id) ?? 0,
        keywords: row.keywords,
        original_language: row.original_language,
        original_title: row.original_title,
        overview: row.overview,
        popularity: toNumber(row.popularity) ?? 0,
        production_companies: row.production_companies,
        production_countries: row.production_countries,
        release_date: row.release_date,
        revenue: toNumber(row.revenue) ?? 0,
        runtime: toNumber(row.runtime),
        spoken_languages: row.spoken_languages,
        status: row.status,
        tagline: toNullableString(row.tagline),
        title: row.title,
        vote_average: toNumber(row.vote_average) ?? 0,
        vote_count: toNumber(row.vote_count) ?? 0,
        cast: row.cast,
        crew: row.crew,
        director: toNullableString(row.director)
    }));
