<template>
    <div class="game-loader">
        <div>
            <input type="text" v-model="searchParams.name" />
        </div>
        <div class="load-menu-filters">
            <div>
                <div class="filter-item load-menu-date-selector">
                    <button @click="showDateFilter = true">
                        Date
                    </button>
                    <div>
                        <PopperPod v-if="showDateFilter">
                            <div class="filter-content">
                                <div>
                                    Date Filter
                                </div>
                                <a @click="showDateFilter = false"><font-awesome-icon icon="times" /></a>
                            </div>
                        </PopperPod>

                    </div>
                </div>
                <div class="filter-item load-menu-level-selector">
                    <button @click="showLevelFilter = true">
                        Level
                    </button>
                    <div>
                        <PopperPod v-if="showLevelFilter">
                            <div class="filter-content">
                                <div>
                                    <LevelFilter 
                                        :games="savedGames"
                                        @filter="filterLevels"
                                    />
                                </div>
                                <a @click="showLevelFilter = false"><font-awesome-icon icon="times" /></a>
                            </div>
                        </PopperPod>
                    </div>
                </div>
            </div>
            
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
import PopperPod from './PopperPod.vue';
import LevelFilter from './LevelFilter.vue';
export default {
    components: {
        SavedGameItem,
        PopperPod,
        LevelFilter
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
            currentMode: 1,
            showDateFilter: false,
            showLevelFilter: false,
            selectedLevels: []
        }
    },
    computed: {
        ...mapState(['savedGames']),
        shouldShowGame () {
            return key => {
                return key.toLowerCase().includes(this.searchParams.name.toLowerCase()) && 
                (this.selectedLevels.includes(key) || this.selectedLevels.length === 0);
            }
        }
    },
    methods: {
        load (game) {
            this.$emit('game-selected', game);
        },
        deleteGame (game) {
            this.$emit('game-deleted', game);
        },
        filterLevels (e) {
            this.selectedLevels = e;
        }
    }
}
</script>

<style>

</style>