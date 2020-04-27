<template>
  <main>
    <div>
      <div class="connection-info">
        <h3>Connection
          <status-indicator :status="status" :pulse="status === 'positive'"/>
        </h3>

      </div>
      <div v-if="status === 'positive'">
        <div class="power-toggle">
          <h4>Power On/Off (CMD + O)</h4>
          <toggle-button
            :value="power"
            :sync="true"
            :width="80"
            :height="40"
            :font-size="18"
            @change="toggleLight($event.value)"
            :labels="{checked: 'On', unchecked: 'Off'}"/>
        </div>
        <div class="brightness-slider">
          <h4>Brightness</h4>
          <vue-slider
            @change="toggleBrightness"
            v-model="brightness">
          </vue-slider>
        </div>
        <div class="color-slider">
          <h4>Color</h4>
          <vue-slider
            @change="toggleColor"
            v-model="color">
          </vue-slider>
        </div>
      </div>
      <div class="connection-problem" v-if="status !== 'positive'">
        <h3>You seem to have connection problems. Make sure that <a href="https://www.yeelight.com/faqs/lan_control">LAN control is enabled for your lamp</a>.</h3>
      </div>
    </div>
  </main>
</template>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Source Sans Pro', sans-serif;
  }

  .connection-info, .power-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
    background-color: azure;
  }

  .connection-info > h3 {
    padding-top: 10px;
  }

  .brightness-slider, .color-slider {
    padding: 8px 16px;
    background-color: beige;
  }

  .connection-problem {
    padding: 8px 16px;
    background-color: red;
  }

</style>
<script>
  import {Lookup} from 'node-yeelight-wifi'

  export default {

    data () {
      return {
        power: false,
        status: 'negative',
        light: null,
        brightness: 0,
        color: 0
      }
    },
    mounted () {
      this.lookupLights()
    },
    methods: {
      lookupLights () {
        let look = new Lookup()

        look.on('detected', (light) => {
          if (light.model === 'lamp2') {
            this.light = light
            this.updateState(light)
            this.status = 'positive'
            this.light.on('connected', () => {
              this.status = 'positive'
            })
            this.light.on('disconnected', () => {
              this.status = 'negative'
            })
            this.light.on('stateUpdate', (updatedLightInfo) => {
              this.updateState(updatedLightInfo)
            })
          } else {
            console.warn('Unsupported model detected: ' + light.model)
          }
        })
      },
      toggleLight (power) {
        this.power = power
        this.light.setPower(power)
      },
      toggleBrightness () {
        this.light.setBright(this.brightness)
      },
      toggleColor () {
        /* let minGreen = 159.06459355853457
        let maxGreen = 223.95190336102957
        let maxDistance = maxGreen - minGreen
        let newColor = this.brightness
        let distance = maxGreen - newColor
        let percentage = distance / maxDistance
        this.light.setRGB([255, 223, 198]) */
      },
      updateState: async function (light) {
        let minGreen = 159.06459355853457
        let maxGreen = 223.95190336102957
        let maxDistance = maxGreen - minGreen
        let newGreen = light.rgb.g
        let distance = maxGreen - newGreen
        let percentage = distance / maxDistance
        console.log(percentage)
        console.log(newGreen)
        console.log(distance)
        console.log(maxDistance)
        this.power = light.power
        this.brightness = light.bright
        this.color = percentage * 100
        await this.$nextTick()
      }
    }
  }
</script>
