<template>
  <div class="calendar-ui">
      <div class="month-selector">
          <a @click="prevMonth"><font-awesome-icon icon="chevron-left" /></a>
          <label>{{monthLabels[currentMonth]}} {{currentYear}}</label>
          <a @click="nextMonth"><font-awesome-icon icon="chevron-right" /></a>
      </div>
      <ul>
          <li v-for="(week, i) in monthArray" :key="i">
              <label v-for="(day, j) in week" :key="j">
                  <a
                    v-if="day > 0"
                    @click="onSelected(day)"
                >
                    {{day}}
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
        day: {
            type: Number,
            default: new Date().getDate()
        }
    },
    data () {
        return {
            currentYear: this.year,
            currentMonth: this.month,
            currentDay: this.day,
            monthLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
        } 
    }
}
</script>

<style>

</style>