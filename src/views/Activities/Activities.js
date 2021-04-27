import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      activities: []
    };
  },
  created() {
    this.getActivities();
  },
  computed: {
    ...mapGetters(['authToken']),
  },
  methods: {
    ...mapActions(['setUser']),
    getActivities() {
      axios
        .get('api/activities/')
        .then((res) => {
          //iterates over the response adding each
          //activity to the array
          res.data.forEach(element => {
            element.repeticion.toString()
            this.activities.push(element);
          });
        })
        .catch((err) => {
          this.$toast.error(err.response.data, { position: 'top-right' });
          setTimeout(this.$toast.clear, 3000);
          //DELETE THIS CODE AFTER GET IS WORKING
          for (let index = 0; index < 5; index++) {
            let truthiness = 1011001
            let test = truthiness.toString()
            // let mon = (test[0] == 1 )
            // let tue = (test[1] == 1 )
            // let wed = (test[2] == 1 )
            // let thu = (test[3] == 1 )
            // let fri = (test[4] == 1 )
            // let sat = (test[5] == 1 )
            // let sun = (test[6] == 1 )
            this.activities.push({
              name: 'a',
              begin: 'x',
              end: 'y',
              color: 'f',
              priority: 'z',
              category : 'v',
              repetition : truthiness.toString(),
              weeks: 10
            }) 
            console.log(typeof test)
          }
          /////////
        });
    },
  },
};
