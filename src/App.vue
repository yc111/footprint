<template>
    <Map/>
</template>

<script>
import { mapActions } from 'vuex';
import Map from './components/Map.vue';
import * as types from './store/actionType';

export default {
  name: 'App',
  components: {
    Map,
  },
  methods: {
    ...mapActions([types.SET_GEODATA]),
  },
  mounted() {
    // this[types.SET_GEODATA]('assets/world.json');
  },
};
</script>

<style scoped lang='scss'>

</style>
