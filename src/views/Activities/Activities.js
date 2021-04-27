import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      user: {
        name: null,
        lastname: null,
        age: null,
        address: null,
        email: null,
      },
    };
  },
  created() {
    this.getUser();
  },
  computed: {
    ...mapGetters(['authToken']),
  },
  methods: {
    ...mapActions(['setUser']),
    getUser() {
      axios
        .get('/users/1')
        .then((res) => {
          this.user.name = res.data.name;
          this.user.lastname = res.data.lastname;
          this.user.age = res.data.age;
          this.user.address = res.data.address;
          this.user.email = res.data.email;
          this.setUser(this.user);
        })
        .catch((err) => {
          this.$toast.error(err.response.data, { position: 'top-right' });
          setTimeout(this.$toast.clear, 3000);
        });
    },
  },
};
