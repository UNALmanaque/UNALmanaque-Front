import axios from 'axios';
import { mapActions } from 'vuex';

import router from '@/router';

export default {
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    ...mapActions(['setToken']),
    login() {
      if (this.email && this.password) {
        axios
          .post('/login', {
            email: this.email,
            password: this.password,
          })
          .then((res) => {
            this.$toast.info(`Logged In`, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
            this.setToken(res.data.accessToken);
            router.push('/');
          })
          .catch((err) => {
            this.$toast.error(err.response.data, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
          });
      }
    },
  },
};
