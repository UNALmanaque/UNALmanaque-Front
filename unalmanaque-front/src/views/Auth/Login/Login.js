


import firebase from 'firebase';
export default {
  data() {
    return {
      email: null,
      password: null,
    };
  },
  methods: {
    login() {
      if (this.email && this.password) {
          firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then((user) => {
            this.$toast.info(`Logged In`, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
            console.log(user);
            this.$router.push('/home');
          })
          .catch((err) => {
            this.$toast.error(err, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
          });

      }
    },
  },
};
