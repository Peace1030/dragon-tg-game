import { configureStore } from '@reduxjs/toolkit'
import score from "./score.ts";
import loading from "./loading.ts";
import user from "./user.ts";
import game from './game.ts';
import skin from './skin.ts';
import boost from './boost.ts';
import purchase from './purchase.ts';
import fren from './fren.ts';
import image from "./image.ts";
import turbo from "./turbo.ts";
import league from "./league.ts";
import squad from "./squad.ts";
import earn from "./earn.ts";
import task from './task.ts';

export const store = configureStore({
    reducer: {
        game: game,
        score: score,
        loading: loading,
        user: user,
        skin: skin,
        boost: boost,
        purchase: purchase,
        fren: fren,
        image: image,
        turbo: turbo,
        league: league,
        squad: squad,
        earn: earn,
        task: task
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})