

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
            axios
                .post('localhost:8080/register/api/user', {
                    userName : "usuario",
                    userEmail : "mail",
                    userPassword : "123"
                })
            console.log(user);
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
