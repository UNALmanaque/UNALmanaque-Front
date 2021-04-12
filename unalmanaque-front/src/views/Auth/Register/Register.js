
import { mapActions } from 'vuex';

import firebase from 'firebase';
import '@/firebase/init'
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
        firebase.auth().createUserWithEmailAndPassword(this.model.email, this.model.password)
          .then(user=> {
            this.model.email = ''
            this.model.password = ''
            this.model.name = ''
            this.model.age = ''
            console.log(user);
          }).catch(err => {
            this.$toast.error(err, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
          })
        
        this.$toast.error('Please check your input', { position: 'top-right' });
        setTimeout(this.$toast.clear, 3000);
      }
    },
  },
};
