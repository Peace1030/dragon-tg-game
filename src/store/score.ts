import {createSlice} from '@reduxjs/toolkit'
import {currentEnergy, energyValue, rechargeValue, tapValue} from "../helpers/score.helper.ts";
import {ScoreSliceType, TurboSliceType} from "../types/store.ts";
import {store} from "./store.ts";
import {turboModeOff} from "./turbo.ts";

const scoreSlice = createSlice({
    name: 'score',
    initialState: {
        temp_value: 0,
        value: '0',
        tap_lvl: 0,
        energy: 1000,
        energy_lvl: 0,
        recharge_lvl: 0,
        bot_lvl: 0,
        last_tap_time: Date.now(),
        tapTimeout: null,
        energyTimeout: null,
        coolDown: false,
    } as ScoreSliceType,
    reducers: {
        setAmount: (state, action) => {
            state.value = (parseInt(state.value) + parseInt(action.payload)).toString();
        },
        setScore: (state, action) => {
            state.tap_lvl = action.payload.tap_lvl;
            state.energy_lvl = action.payload.energy_lvl;
            state.recharge_lvl = action.payload.recharge_lvl;
            state.bot_lvl = action.payload.bot_lvl;
            state.value = action.payload.value.toString();
            state.last_tap_time = action.payload.last_tap_time == null ? Math.floor(Date.now() / 1000) : action.payload.last_tap_time;
            state.energy = action.payload.last_tap_time == null ? energyValue(state.energy_lvl) : currentEnergy(state.last_tap_time, action.payload.last_energy_left, state.energy_lvl, state.recharge_lvl);
        },
        increment: (state, action) => {
            if ((state.energy - tapValue(state.tap_lvl)) <= 0) {
                console.log('Down bad')
                state.coolDown = true;
                state.value = (BigInt(state.value) + BigInt(state.energy)).toString();
                state.temp_value += state.energy;
                state.energy = 0;
                state.last_tap_time = Math.floor(Date.now() / 1000);
                if (state.temp_value > 0) {
                    action.payload.emit('mine', {
                        value: state.temp_value,
                        energy: state.energy,
                        time: state.last_tap_time,
                    });
                    state.temp_value = 0;
                }
            } else {
                state.value = (BigInt(state.value) + BigInt(tapValue(state.tap_lvl))).toString();
                state.temp_value += tapValue(state.tap_lvl);
                state.energy -= tapValue(state.tap_lvl);
                state.last_tap_time = Math.floor(Date.now() / 1000);
                if ((state.temp_value / tapValue(state.tap_lvl)) >= 100) {
                    action.payload.emit('mine', {
                        value: state.temp_value,
                        energy: state.energy,
                    });
                    state.temp_value = 0;
                }
            }
        },
        dump_increment: (state, action) => {
            // if last tap time is greater than 5 seconds
            if (state.temp_value > 0) {
                action.payload.emit('mine', {
                    value: state.temp_value,
                    energy: state.energy,
                });
                state.temp_value = 0;
            }
        },
        increaseEnergy: (state) => {
            if (state.energy < energyValue(state.energy_lvl)) {
                const energy_to_be = state.energy + rechargeValue(state.recharge_lvl);
                state.energy = energy_to_be > energyValue(state.energy_lvl) ? energyValue(state.energy_lvl) : energy_to_be;
            }
        },
        setTapTimeout: (state, action) => {
            state.tapTimeout = action.payload;
        },
        setEnergyTimeout: (state, action) => {
            state.energyTimeout = action.payload;
        },
        resetCoolDown: (state) => {
            state.coolDown = false;
        },
        addToTempValue: (state, action) => {
            state.temp_value += action.payload;
        },
        addToValue: (state, action) => {
            state.value = (BigInt(state.value) + BigInt(action.payload)).toString();
        },
        decreaseValue: (state, action) => {
            state.value = (BigInt(state.value) - BigInt(action.payload)).toString();
        },
        resetTempValue: (state) => {
            state.temp_value = 0;
        }
    }
})

export const {
    setScore,
    setTapTimeout,
    setEnergyTimeout,
    resetCoolDown,
    increment,
    dump_increment,
    increaseEnergy,
    addToTempValue,
    addToValue,
    decreaseValue,
    resetTempValue,
    setAmount
} = scoreSlice.actions
export default scoreSlice.reducer