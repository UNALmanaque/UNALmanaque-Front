import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';

export default {
  data() {
    return {
      activities: [],
      id: 10
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
      //var userId;
      const user =firebase.auth().currentUser;
      if(user){

      axios.get('/api/user/find/'+user.email)
      .then(response => {
        console.log(response.data.userId)
        this.id = response.data.userId;
        
      });
    
    
      console.log("holaaa", this.id)
      axios
        .get('/api/event/find/'+this.id)
        .then((res) => {
          //iterates over the response adding each
          //activity to the array
          console.log(res)
          res.data.forEach(element => {
            console.log(element)
            element.eventDaily.toString()
            this.activities.push(element);
          });
        })
        .catch((err) => {
          console.log(err)
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
      }
    },
    deleteActivity(id){
      //Here should go a post method
      console.log('activity to delete: ', id);
      axios.delete('/api/event/delete/'+id)
      .then( res => {
        this.$toast.info(`Borrado exitoso`, { position: 'top-right' });
        console.log(res)
        this.activities= []
        this.getActivities()
        
      });
      //call the get activity again
      //getActivities()
    },
    editActivity(index){
      this.activityid=this.activities[index].eventId;
      console.log("eeee", this.activityid)
      console.log('Activity is:');
      console.log(this.activities[index]);
      this.$router.push('/edit-activity');
    }
  },
};
