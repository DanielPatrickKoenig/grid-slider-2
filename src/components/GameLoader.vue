<template>
    <div class="game-loader">
        <div>
            <input type="text" v-model="searchParams.name" />
        </div>
        <div class="load-menu-filters">
            <div class="load-menu-date-selector"></div>
            <div class="load-menu-modes">
                <a 
                    @click="currentMode = 0"
                    :class="{selected: currentMode === 0}"
                >
                    <font-awesome-icon icon="th" />
                </a>
                <a 
                    @click="currentMode = 1"
                    :class="{selected: currentMode === 1}"
                >
                    <font-awesome-icon icon="list" />
                </a>
            </div>
        </div>
        
        <div class="game-list-container">
            <ul :class="modes[currentMode]">
                <SavedGameItem
                    v-for="(game, key, i) in savedGames" 
                    :key="i"
                    :name="key"
                    :game="game"
                    @load="load"
                    @delete="deleteGame"
                    v-show="shouldShowGame(key)"
                />
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import SavedGameItem from './SavedGameItem.vue';
export default {
    components: {
        SavedGameItem
    },
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
            currentMode: 1
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