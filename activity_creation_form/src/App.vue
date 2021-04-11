<template>
  <v-app>
    <Activity_Form></Activity_Form>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import Activity_Form from './components/Activity_Form';

export default {
  name: 'App',

  components: {
    HelloWorld,
    Activity_Form
  },

  data: () => ({
    //
  }),
};
</script>
