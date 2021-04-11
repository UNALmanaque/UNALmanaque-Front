<template>
  <v-app> <!-- Todo lo que se quiera trabajar con Vuetify se pone aqui adentro en v-app -->
    <Activity_Form></Activity_Form>


    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>

import Activity_Form from './components/Activity_Form';

export default {
  name: 'App',

  components: {
    Activity_Form,
  },

  data: () => ({
    //
  }),
};
</script>
