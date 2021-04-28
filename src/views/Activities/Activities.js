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
            this.activities.push({
              id: index,
              name: 'a',
              begin: 'x',
              end: 'y',
              color: 'f',
              priority: 'z',
              category : 'v',
              repetition : truthiness.toString(),
              weeks: 10
            })
          }
          /////////
        });
    },
    deleteActivity(id){
      //Here should go a post method
      console.log('activity to delete: ', id);
      //call the get activity again
      //getActivities()
    },
    editActivity(index){
      console.log('Activity is:');
      console.log(this.activities[index]);
      this.$router.push('/edit-activity');
    }
  },
};
