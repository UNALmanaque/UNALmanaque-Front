<template>
  <div class="main-nav pt-4 pb-3">
    <div class="container-fluid">
      <div class="row">
        <div class="title-container col-1">
          <p class="app-title">App</p>
        </div>
        <div class="col-11 d-flex flex-row">
          <div class="nav-item" :class="{ active: route === 'Home' }">
            <router-link class="nav-link" to="/">Home</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'Profile' }">
            <router-link class="nav-link" to="/profile">Profile</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'Activity' }">
            <router-link class="nav-link" to="/activity">Activity</router-link>
          </div>
          <div class="nav-item" :class="{ active: route === 'User_Information' }">
            <router-link class="nav-link" to="/user_information">User Information</router-link>
          </div>
          <div class="nav-item logout">
            <a class="nav-link" @click="logout">Logout</a>
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
