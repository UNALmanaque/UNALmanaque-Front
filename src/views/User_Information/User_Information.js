import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

import router from '@/router';

export default {
  data() {
    return {
      user: {
        name: null,
        age: null,
        email: null,
      },
    };
  },
  created() {
    this.getUser();
  },
  computed: {
    ...mapGetters(['authToken', 'currentUser']),
  },
  methods: {
    ...mapActions(['setUser']),
    getUser() {
      this.user = this.currentUser;
    },
    updateUser() {
      if (
        this.user.name &&
        this.user.age &&
        this.user.email  
      ) {
        axios
          .put('/users/1', this.user)
          .then(() => {
            this.$toast.info(`Updated Successfully`, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
            this.setUser(this.user);
            router.push('/');
          })
          .catch((err) => {
            this.$toast.error(err.response.data, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
          });
      } else {
        alert('user don\'t found');
      }
    },
  },
};
