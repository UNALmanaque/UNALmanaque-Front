import axios from 'axios';
import { mapActions } from 'vuex';

import router from '@/router';

export default {
  data() {
    return {
      model: {
        email: null,
        password: null,
        name: null,
        age: null
      },
    };
  },
  methods: {
    ...mapActions(['setToken']),
    register() {
      if (
        this.model.email &&
        this.model.password &&
        this.model.name &&
        this.model.age
      ) {
        axios
          .post('/register', this.model)
          .then((res) => {
            this.setToken(res.data.accessToken);
            router.push('/');
          })
          .catch((err) => {
            this.$toast.error(err.response.data, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
          });
      } else {
        this.$toast.error('Please check your input', { position: 'top-right' });
        setTimeout(this.$toast.clear, 3000);
      }
    },
  },
};
