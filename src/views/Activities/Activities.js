import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';

export default {
  data() {
    return {
      activities: [],
      id: 0
    };
  },
  created() {
    //this.getUserId();
    //this.sampleActivities();
  },
  computed: {
    ...mapGetters(['authToken']),
  },
  methods: {
    ...mapActions(['setUser']),
    getUserId(){
      const user = firebase.auth().currentUser;
      if(user){
        axios.get('/api/user/find/'+user.email)
        .then(response => {
          this.id = response.data.userId;
          this.getActivities()
        }).catch(err=>{
          this.$toast.error(err.response.data, { position: 'top-right' });
          setTimeout(this.$toast.clear, 3000);
        });
      }
    },
    getActivities() {
      axios
        .get('/api/event/find/'+this.id)
        .then((res) => {
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
        });
      
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
    editActivity(eventId){
      this.$router.push(`edit-activity?eventId=${eventId}`);
    },
    sampleActivities(){
      for (let index = 0; index < 5; index++) {
        this.activities.push({
          eventStartDate: 'y',
          eventEndDate: 'z',
          eventId: 15,
          eventName: 'x',
          eventColor: 'red',
          eventPriority: 1,
          category: {
            categoryName: 'wtf'
          },
          eventDaily: '1011010',
          eventWeek: 4
        })
      }
    }
  },
};
