<template>
    <ul>
        <li v-for="(game, key, i) in savedGames" :key="i">
            <span>{{key}}</span><span>{{game.currentLevel}}</span><button @click="load(game)">Load</button><button @click="deleteGame(key)">Delete</button>
        </li>
    </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState(['savedGames'])
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