<template>
  <div id="app">
    <div id="nav">
      <div v-if="menuOpen" class="blocker" @click="closeAllMenus"></div>
      <div class="slide-menu game-menu" :class="[menuStates.game.state, {activated: menuStates.game.activated}]">
        <div>Badges Rock</div>
      </div>
      <font-awesome-icon icon="star" class="nav-menu-icon star" :class="{activated: menuStates.main.activated}" @click="toggleMenu('game')" />
      <div class="slide-menu main-menu" :class="[menuStates.main.state, {activated: menuStates.main.activated}]">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
      </div>
      <font-awesome-icon icon="bars" class="nav-menu-icon hamburger" :class="{activated: menuStates.main.activated}" @click="toggleMenu('main')" />
    </div>
    <router-view class="inner-page"/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
    data () {
      return {
        menuStates:{
          main: {
            state: 'closed',
            activated: false
          },
          game: {
            state: 'closed',
            activated: false
          }
        }
      }
    },
    methods: {
      ...mapActions(['loadGames']),
      toggleMenu(menu){
        this.menuStates[menu].state = this.menuStates[menu].state === 'closed' ? 'open' : 'closed';
        if(this.menuStates[menu].state === 'open'){
          for(let m in this.menuStates){
            if(m !== menu){
              this.menuStates[m].state = 'closed';
            }
          }
        }
      },
      closeAllMenus(){
        for(let m in this.menuStates){
          this.menuStates[m].state = 'closed';
        }
      }
    },
    created () {
      this.loadGames();
    },
    computed: {
      menuOpen () {
        return Object.keys(this.menuStates).filter(item => this.menuStates[item].state === 'open').length > 0;        
      }
    },
    mounted () {
      setTimeout(() => {
        for(let m in this.menuStates){
          this.menuStates[m].activated = true;
        }
      },1000);
    }
}
</script>


<style lang="scss">
@import "./scss/default.scss";
</style>
