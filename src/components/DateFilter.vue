<template>
  <div>
      <div>
          {{rangeString}}
      </div>
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
        :sig="sig"
        @selection="startSelected"
      />
      <CalendarUI 
        v-if="currentMode === dateModes.BETWEEN"
        :year="end.year"
        :month="end.month"
        :day="end.date"
        :sig="sig"
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
    props: {
        range: Array,
        mode: String
    },
    components: {
        CalendarUI
    },
    data () {
        return {
            start: {
                year: this.range && this.range[0] ? this.range[0].year : baseDate.getFullYear(),
                month: this.range && this.range[0] ? this.range[0].month : baseDate.getMonth(),
                date: this.range && this.range[0] ? this.range[0].day : -1
            },
            end: {
                year: this.range && this.range[1] ? this.range[1].year : baseDate.getFullYear(),
                month: this.range && this.range[1] ? this.range[1].month : baseDate.getMonth(),
                date: this.range && this.range[1] ? this.range[1].day : -1
            },
            dateModes: modes,
            currentMode: this.mode ? this.mode : modes.NONE,
            dates: [
                null,
                null
            ],
            sig: '0',
            rangeString: 'No selected dates'
        }
    },
    mounted () {
        if (this.currentMode !== this.dateModes.NONE) {
            console.log('a');
            this.dates[0] = { month: this.start.month, day: this.start.date, year: this.start.year };
            if(this.currentMode === this.dateModes.BETWEEN){
                console.log('b');
                this.dates[1] = { month: this.end.month, day: this.end.date, year: this.end.year };
            }
        }
        console.log('c');
        console.log(this.dates);
        this.setRangeString();
    },
    methods: {
        onModeChange () {
            this.dates = [
                null,
                null
            ];
            this.sig = `${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}-${Math.random().toString().split('.').join('')}`
            this.setRangeString();
            this.$forceUpdate();
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
            this.setRangeString();
            return filteredGames;
        },
        getDescription() {
            return { mode: this.currentMode, dates: this.dates };
        },
        setRangeString () {
            if(this.currentMode === this.dateModes.NONE){
                this.rangeString = 'No selected dates'
            }
            else {
                const startString = this.dates[0] && this.dates[0].day > 0 ? [this.dates[0].month + 1, this.dates[0].day, this.dates[0].year].join('/') : 'No date selected';
                const endString = this.dates[1] && this.dates[1].day > 0 ? [this.dates[1].month + 1, this.dates[1].day, this.dates[1].year].join('/') : 'No date selected';
                this.rangeString = this.currentMode === this.dateModes.BETWEEN ? `${startString} - ${endString}` : `${startString}`;
            }
              
        }
    }
}
</script>

<style>

</style>