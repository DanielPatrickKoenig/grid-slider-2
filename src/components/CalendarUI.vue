<template>
  <div class="calendar-ui">
      <div class="month-selector">
          <a @click="prevMonth"><font-awesome-icon icon="chevron-left" /></a>
          <label>{{monthLabels[currentMonth]}} {{currentYear}}</label>
          <a @click="nextMonth"><font-awesome-icon icon="chevron-right" /></a>
      </div>
      <ul>
          <li 
            v-for="(week, i) in monthArray" 
            :key="i"
        >
              <label 
                v-for="(d, j) in week" 
                :key="j"
                :class="{'selected-day': currentDay === d && currentMonth === selectedMonth && currentYear === selectedYear}"
            >
                  <a
                    v-if="d > 0"
                    @click="onSelected(d)"
                >
                    {{d}}
                </a>
              </label>
          </li>
      </ul>
  </div>
</template>

<script>
import calendar from 'calendar';
export default {
    props: {
        year: {
            type: Number,
            default: new Date().getFullYear()
        },
        month: {
            type: Number,
            default: new Date().getMonth()
        },
        day: Number
    },
    data () {
        return {
            currentYear: this.year,
            currentMonth: this.month,
            currentDay: this.day,
            selectedYear: this.year,
            selectedMonth: this.month,
            monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
    },
    watch: {
        day () {
            console.log('date watched');
            this.currentDay = this.day;
            this.$forceUpdate();
        }
    },
    computed: {
        monthArray () {
            const cal = new calendar.Calendar();
            return cal.monthDays(this.currentYear, this.currentMonth);
        },
    },
    methods: {
        prevMonth () {
            this.currentMonth--;
            if (this.currentMonth < 0) {
                this.currentMonth = this.monthLabels.length - 1;
                this.currentYear--;
            }
        },
        nextMonth () {
            this.currentMonth++;
            if (this.currentMonth > this.monthLabels.length - 1) {
                this.currentMonth = 0;
                this.currentYear++;
            }
        },
        onSelected (day) {
            this.currentDay = day;
            this.$emit('selection', { year: this.currentYear, month: this.currentMonth, day: this.currentDay });
            this.selectedYear = this.currentYear;
            this.selectedMonth = this.currentMonth;
        } 
    }
}
</script>

<style>

</style>