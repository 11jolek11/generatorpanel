<script setup>
import { onMounted } from "vue";
// import HelloWorld from "./components/HelloWorld.vue";
// import TheWelcome from "./components/TheWelcome.vue";
import Generator from "./components/Generator.vue";
import mqttRegistrator from "./registers/mqtt";
import useAgregatorStore from "./store/agregator"
import useGeneratorStore from "./store/generator"


onMounted(function () {
  var reg = mqttRegistrator()
})

</script>

<template>

</template>


