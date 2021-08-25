<template>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
  <div class="main-nav pt-4 pb-3">
    <div class="container-fluid">
      <div class="row">
        <div class="title-container col-1">
          <p class="app-title fw-bolder">UNALmanaque</p>
        </div>
        <div class="col-11 d-flex flex-row">
          <div class="nav-item" :class="{ active: route === 'Home' }">
            <router-link class="nav-link" to="/home">Principal</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'User_Information' }">
            <router-link class="nav-link" to="/user_information">Información de usuario</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'Profile' }">
            <router-link class="nav-link" to="/profile">Perfil</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'Today_Activities' }">
            <router-link class="nav-link" to="/today_activities">Para hoy</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'Activities' }">
            <router-link class="nav-link" to="/activities">Actividades</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'Activity' }">
            <router-link class="nav-link" to="/activity">Crear Actividad</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'Calendar' }">
            <router-link class="nav-link" to="/calendar">Calendario</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'Stats' }">
            <router-link class="nav-link" to="/stats">Estadisticas</router-link>
          </div>
          <div class="nav-item logout">
            <a class="nav-link" @click="logout">Cerrar sesión</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';

import router from '@/router'

export default {
  name: 'navbar',
  computed: {
    route() {
      return this.$route.name;
    },
  },
  methods: {
    ...mapActions(['setUser', 'setToken']),
    logout() {
      this.setToken(null);
      this.setUser({});
      router.push('/login');
    },
  },
};
</script>
<style scoped>
.main-nav {
  background-color: #212529;
}

.title-container {
  padding-left: 1rem;
}

.app-title {
  text-align: left;
  font-size: 1.5rem;
  color: #fff;
}

.top-bar {
  width: 100%;
  background-color: #000;
  color: #fff;
  padding: 5px;
}

.nav-link {
  color: rgba(182, 182, 182, 0.6) !important;
}

.nav-link:hover {
  color: rgba(244, 187, 0, 0.6) !important;
}

.active .nav-link {
  color: rgb(255, 255, 255, 1) !important;
  opacity: 1 !important;
}

.logout {
  margin-left: auto;
}

.logout :hover {
  cursor: pointer;
}
</style>
