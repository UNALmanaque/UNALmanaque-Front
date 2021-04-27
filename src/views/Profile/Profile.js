import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

import router from '@/router';

export default {
  data() {
    return {
      user: {
        name: null,
        lastname: null,
        age: null,
        address: null,
        email: null,
        password: null,
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
        this.user.lastname &&
        this.user.age &&
        this.user.address &&
        this.user.email &&
        this.user.password
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
        alert('Please fill all input fields');
      }
    },
  },
};
