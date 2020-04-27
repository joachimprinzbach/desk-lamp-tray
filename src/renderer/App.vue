<template>
  <div id="app">
    <tray-arrow />
    <landing-page />
  </div>
</template>

<script>
  import LandingPage from '@/components/LandingPage'
  import TrayArrow from '@/components/TrayArrow'

  export default {
    name: 'juux',
    components: {
      LandingPage,
      TrayArrow
    }
  }
</script>

<style>
  body {
    background: transparent;
  }
</style>
