<template>
    <ul class="level-filter">
        <li 
            v-for="(item, i) in uniqueLevels" 
            :key="i"
        >
            <label>
                <input type="checkbox" v-model="item.selected" @change="onFilter" />
                {{item.level}}
            </label>
        </li>
    </ul>
</template>

<script>
import BaseFilter from './BaseFilter.js';
import {uniq} from 'lodash';
export default {
    extends: BaseFilter,
    data () {
        return {
            uniqueLevels: uniq(Object.keys(this.games).map(item => this.games[item].currentLevel)).sort().map(item => ({level: item, selected: this.selection && this.selection.levels.includes(item)}))
        }
    },
    computed: {
        selectedLevels () {
            return this.uniqueLevels.filter(item => item.selected).map(item => item.level);
        }
    },
    methods: {
        getFilteredGames () {
            return Object.keys(this.games).filter(item => this.selectedLevels.includes(this.games[item].currentLevel));
        },
        getDescription() {
            return this.selectedLevels;
        }
    }
}
</script>

<style>

</style>