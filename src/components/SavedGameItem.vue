<template>
  <li>
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
        <span class="name">{{name}}</span>
        <span>({{game.currentLevel}} | {{formattedDate(game.date)}})</span>
    </div>
    <div class="actions">
        <button @click="loadClicked">Load</button>
        <button @click="deleteClicked" class="secondary">Delete</button>
    </div>
</li>
</template>

<script>
import { gameColors } from '../utils/Utilities.js';
export default {
    props: {
        game: Object,
        name: String
    },
    data () {
        return {
            colors: gameColors
        }
    },
    methods: {
        loadClicked () {
            this.$emit('load', this.game);
        },
        deleteClicked () {
            this.$emit('delete', this.name);
        }
    },
    computed: {
        formattedDate(){
            return value => {
                const date = new Date(value);
                return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/');
            }
        }
    }
}
</script>

<style>

</style>