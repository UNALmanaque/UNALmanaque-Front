import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';

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
    ...mapGetters(['authToken']),
  },
  methods: {
    ...mapActions(['setUser']),
    getUser() {
      const user =firebase.auth().currentUser;
      if(user){
        console.log(user.email)

      axios.get('/api/user/find/'+user.email)
      .then(res => {
        this.user.name = res.data.userName;
        this.user.age = res.data.userBorn;
        this.user.email = res.data.userEmail;
        this.setUser(this.user);
      })
      .catch((err) => {
        this.$toast.error(err.response.data, { position: 'top-right' });
        setTimeout(this.$toast.clear, 3000);
      });
    }


      
    },
  },
};
