<template>
  <div>
      <select 
        v-model="currentMode"
        @change="onModeChange"
      >
          <option v-for="(mode, key, i) in dateModes" :key="i" :value="mode">{{mode}}</option>
      </select>
      <CalendarUI 
        v-if="currentMode !== dateModes.NONE"
        :year="start.year"
        :month="start.month"
        :day="start.date"
        @selection="startSelected"
      />
      <CalendarUI 
        v-if="currentMode === dateModes.BETWEEN"
        :year="end.year"
        :month="end.month"
        :day="end.date"
        @selection="endSelected"
      />
  </div>
</template>

<script>
import CalendarUI from './CalendarUI.vue';
import BaseFilter from './BaseFilter.js';
const baseDate = new Date();
const modes = {
    NONE: 'choose an option',
    ON: 'on',
    BEFORE: 'before',
    AFTER: 'after',
    BETWEEN: 'between'
}
export default {
    extends: BaseFilter,
    components: {
        CalendarUI
    },
    data () {
        return {
            start: {
                year: baseDate.getFullYear(),
                month: baseDate.getMonth(),
                date: baseDate.getDate()
            },
            end: {
                year: baseDate.getFullYear(),
                month: baseDate.getMonth(),
                date: baseDate.getDate()
            },
            dateModes: modes,
            currentMode: modes.NONE,
            dates: [
                null,
                null
            ]
        }
    },
    methods: {
        onModeChange () {
            if([this.dateModes.BETWEEN, this.dateModes.NONE].includes(this.currentMode)){
                this.dates[1] = null;
            }
            if(this.currentMode === this.dateModes.BETWEEN){
                this.dates[0] = null;
            }
        },
        startSelected (e) {
            this.dates[0] = e;
            this.onFilter();
        },
        endSelected (e) {
            this.dates[1] = e;
            this.onFilter();
        },
        getFilteredGames () {
            let filteredGames = [];
            switch (this.currentMode){
                case this.dateModes.ON: {
                    if(this.dates[0]){
                        filteredGames = Object.keys(this.games).filter(item => {
                            const gDate = new Date(this.games[item].date);
                            const yearMatch = gDate.getFullYear() === this.dates[0].year;
                            const monthMatch = gDate.getMonth() === this.dates[0].month;
                            const dayMatch = gDate.getDate() === this.dates[0].day;
                            return yearMatch && monthMatch && dayMatch;
                        });
                        
                    }
                    break;
                }
                case this.dateModes.BEFORE: {
                    if(this.dates[0]){
                        const selectedDate = new Date([this.dates[0].month + 1, this.dates[0].day, this.dates[0].year].join('/')).getTime();
                        filteredGames = Object.keys(this.games).filter(item => this.games[item].date < selectedDate);
                    }
                    break;
                }
                case this.dateModes.AFTER: {
                    if(this.dates[0]){
                        const selectedDate = new Date([this.dates[0].month + 1, this.dates[0].day, this.dates[0].year].join('/')).getTime();
                        filteredGames = Object.keys(this.games).filter(item => this.games[item].date > selectedDate);
                    }
                    break;
                }
                case this.dateModes.BETWEEN: {
                    if(this.dates[0] && this.dates[1]){
                        const selectedDates = this.dates.map(item => new Date([item.month + 1, item.day, item.year].join('/')).getTime());
                        filteredGames = Object.keys(this.games).filter(item => this.games[item].date > selectedDates[0] && this.games[item].date < selectedDates[1]);
                    }
                    break;
                }
            }
            return filteredGames;
        },
        getDescription() {
            return this.dates;
        }
    }
}
</script>

<style>

</style>