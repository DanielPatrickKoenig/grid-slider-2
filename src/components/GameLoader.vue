<template>
    <div class="game-loader">
        <div>
            <input type="text" v-model="searchParams.name" />
        </div>
        <ul>
            <li 
                v-for="(game, key, i) in savedGames" 
                :key="i"
                v-show="shouldShowGame(key)"
            >
                <span>{{key}}</span><span>{{game.currentLevel}}</span><button @click="load(game)">Load</button><button @click="deleteGame(key)">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data () {
        return {
            searchParams: {
                name: '',
                dates: [],
                level: -1
            }
        }
    },
    computed: {
        ...mapState(['savedGames']),
        shouldShowGame () {
            return key => {
                return key.toLowerCase().includes(this.searchParams.name.toLowerCase());
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