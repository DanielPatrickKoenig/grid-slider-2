<template>
    <div class="game-loader">
        <div>
            <input class="search-field" type="text" v-model="searchParams.name" />
        </div>
        <div class="load-menu-filters">
            <div>
                <div class="filter-item load-menu-date-selector">
                    <button 
                        class="secondary"
                        :class="{active: showDateFilter}"
                        @click="showDateFilter = true"
                    >
                        Date
                    </button>
                    <div>
                        <PopperPod v-if="showDateFilter">
                            <div class="filter-content">
                                <div>
                                    <DateFilter 
                                        :games="savedGames"
                                        :selection="{ range: selectedDates, mode: dateRangeMode }"
                                        @filter="filterDates"
                                    />
                                </div>
                                <a 
                                    @click="showDateFilter = false"
                                    class="pod-close"
                                >
                                    <font-awesome-icon icon="times" />
                                </a>
                            </div>
                        </PopperPod>
                        <div 
                            v-if="selectedDates.length"
                            class="selection-label"
                        >
                            {{ dateSelectionText }}
                            <a @click="clearDateFilter"><font-awesome-icon icon="times" /></a>
                        </div>
                    </div>
                </div>
                <div class="filter-item load-menu-level-selector">
                    <button
                        class="secondary"
                        :class="{active: showLevelFilter}" 
                        @click="showLevelFilter = true"
                    >
                        Level
                    </button>
                    <div>
                        <PopperPod v-if="showLevelFilter">
                            <div class="filter-content">
                                <div>
                                    <LevelFilter 
                                        :games="savedGames"
                                        :selection="{ levels: selectedLevels }"
                                        @filter="filterLevels"
                                    />
                                </div>
                                <a 
                                    @click="showLevelFilter = false"
                                    class="pod-close"
                                >
                                    <font-awesome-icon icon="times" />
                                </a>
                            </div>
                        </PopperPod>
                        <div 
                            v-if="selectedLevels.length"
                            class="selection-label"
                        >
                            {{ selectedLevels.join(',') }}
                            <a @click="clearLevelFilter"><font-awesome-icon icon="times" /></a>
                        </div>
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
import DateFilter from './DateFilter.vue';
export default {
    components: {
        SavedGameItem,
        PopperPod,
        LevelFilter,
        DateFilter
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
            levelFilteredGames: [],
            dateFilteredGames: [],
            selectedLevels: [],
            selectedDates: [],
            selectedDatesLabel: '',
            selectedDatesContext: '',
            hasDateRange: false,
            dateRangeMode: null
        }
    },
    computed: {
        ...mapState(['savedGames']),
        shouldShowGame () {
            return key => {
                return key.toLowerCase().includes(this.searchParams.name.toLowerCase()) && 
                (this.levelFilteredGames.includes(key) || this.levelFilteredGames.length === 0) &&
                (this.dateFilteredGames.includes(key) || (this.selectedDates.length === 0 && this.dateFilteredGames.length === 0));
            }
        },
        dateSelectionText () {
            const labelContext = this.selectedDatesContext === '' ? '' : `${this.selectedDatesContext} `;
            return `${labelContext}${this.selectedDatesLabel}`;
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
            this.levelFilteredGames = e.values;
            this.selectedLevels = e.description;
        },
        filterDates (e) {
            this.dateFilteredGames = e.values;
            this.selectedDates = e.description.dates;
            this.dateRangeMode = e.description.mode;
            this.selectedDatesContext = e.context;
            this.selectedDatesLabel = this.selectedDates.filter(item => item !== null && item.day > 0).map(item => [item.month + 1, item.day, item.year].join('/')).join(' - ');
        },
        clearDateFilter () {
            this.selectedDates = [];
            this.dateFilteredGames = [];
            this.dateRangeMode = null;
            this.selectedDatesContext = '';
        },
        clearLevelFilter () {
            this.selectedLevels = [];
            this.levelFilteredGames = [];
        }
    }
}
</script>

<style>

</style>