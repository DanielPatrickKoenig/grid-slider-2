<template>
    <div class="game-loader">
        <div>
            <input type="text" v-model="searchParams.name" />
        </div>
        <div>
            <button @click="currentMode = 0">Grid</button>
            <button @click="currentMode = 1">List</button>
        </div>
        <ul :class="modes[currentMode]">
            <li 
                v-for="(game, key, i) in savedGames" 
                :key="i"
                v-show="shouldShowGame(key)"
            >
                <div class="preview">
                    <div 
                        v-for="(row, i) in game.currentPattern" 
                        :key="i"
                        :style="{height: `${100 / game.currentPattern.length}%`}"
                    >
                        <div
                            v-for="(block, j) in row" 
                            :key="j"
                            :style="{width: `${100 / row.length}%`, height: '100%', 'background-color': colors[block]}"
                        >
                            &nbsp;
                        </div>
                    </div>
                </div>
                <div class="details">
                    <span class="name">{{key}}</span>
                    <span>({{game.currentLevel}} | {{formattedDate(game.date)}})</span>
                </div>
                <div class="actions">
                    <button @click="load(game)">Load</button>
                    <button @click="deleteGame(key)" class="secondary">Delete</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { gameColors } from '../utils/Utilities.js';
export default {
    data () {
        return {
            searchParams: {
                name: '',
                dates: [],
                level: -1
            },
            modes: [
                'grid-mode',
                'list-mode'
            ],
            currentMode: 1,
            colors: gameColors
        }
    },
    computed: {
        ...mapState(['savedGames']),
        shouldShowGame () {
            return key => {
                return key.toLowerCase().includes(this.searchParams.name.toLowerCase());
            }
        },
        formattedDate(){
            return value => {
                const date = new Date(value);
                return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/');
            }
        }
    },
    methods: {
        load (game) {
            this.$emit('game-selected', game);
        },
        deleteGame (game) {
            this.$emit('game-deleted', game);
        }
        
    }
}
</script>

<style>

</style>