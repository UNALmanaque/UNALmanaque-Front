

import firebase from 'firebase';
import axios from 'axios';
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
    register() {
        let post = {userName : this.model.name, userEmail : this.model.email, userPassword : this.model.password, userBorn : this.model.age};
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
            this.$toast.info(`Registro exitoso`, { position: 'top-right' });
            console.log(user);
            axios
                .post('/api/user', post)
          }).catch(err => {
            this.$toast.error(err, { position: 'top-right' });
            setTimeout(this.$toast.clear, 3000);
          })
        }else { 
        this.$toast.error('Please check your input', { position: 'top-right' });
        setTimeout(this.$toast.clear, 3000);
      }
    },
  },
};
