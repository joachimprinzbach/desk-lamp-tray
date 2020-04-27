<template>
  <div id="app">
    <div class="tray-arrow"></div>
    <landing-page></landing-page>
  </div>
</template>

<script>
  import LandingPage from '@/components/LandingPage'

  export default {
    name: 'juux',
    components: {
      LandingPage
    }
  }
</script>

<style>
  body {
    background: transparent;
  }

  .tray-arrow {
    margin: auto;
    width: 0;
    height: 0;
    border-right: 1rem solid transparent;
    border-bottom: 1rem solid azure;
    border-left: 1rem solid transparent;
  }

</style>
