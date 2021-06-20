<template>
  <div class="modal-widnow blocker" :class="{ dialog }">
      <div class="inner-window">
          <slot>
              WINDOW CONTENT
          </slot>
          <div 
            class="navigation"
            v-if="cta"
          >
              <button v-if="cta" @click="ctaClicked">{{cta}}</button>
          </div>
          <font-awesome-icon
            v-if="closable"
            icon="times" 
            class="app-icon modal-close-icon" 
            @click="close" 
          />
      </div>
      
  </div>
</template>

<script>
export default {
    props: {
        cta: String,
        closable: {
            type: Boolean,
            default: true
        },
        dialog: Boolean
    },
    methods: {
        ctaClicked () {
            this.$emit('cta-clicked');
        },
        close () {
            this.$emit('dismiss');
        }
    }
}
</script>

<style>

</style>