import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';


export default {
  data() {
    return {
      activities: [],
      id: 0,
      states: [{
        id: 0,
        name: "Por hacer",
        color: "#ffff00",
        key: 2
      },
      {
        id: 1,
        name: "En curso",
        color: "#7cfc00",
        key:1
      },
     
      {
        id:2,
        name: "Finalizado",
        color: "#000000",
        key: 3
      },
      {
        id: -1,
        name: "No finalizado",
        color: "ff0000",
        key: 0
      }
    ],
      
      
    };
  },
  created() {
    
    this.getUserId();
    this.getActivities();
    console.log("see", this.states.length)
    //this.sampleActivities();
  },
  computed: {
    ...mapGetters(['authToken']),
    activitylist(){
      this.getActivities()
    }
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
      this.activities=[]
      axios
        .get('/api/event/find/'+this.id)
        .then((res) => {
          res.data.forEach(element => {
<<<<<<< Updated upstream
            console.log("nombre:",element.eventName)
            console.log("nombre:",element.eventCurStreak)
=======
            console.log(element)
>>>>>>> Stashed changes
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
    editState(act_id, state){
<<<<<<< Updated upstream
      if(state==2) state=2
      else state=state+1

=======
      if(state==-1) state=-1
      else if(state==2) state==2
      else { state=state+1
      this.activities.forEach(activity => {
        if(activity.eventId == act_id) activity.eventState = state;
      })
>>>>>>> Stashed changes
      let act = this.activities.filter(activity => activity.eventId == act_id)

      let putt = {
        "eventState": state,
        "eventId": act[0].id
        }

      if(state==2){
        putt["eventCurStreak"]= (act[0].eventCurStreak)+1
        let max
        if(act[0].eventMaxStreak<act[0].eventCurStreak){
          max = act[0].eventCurStreak
        }else{
          max = act[0].eventMaxStreak
        }
        putt["eventMaxStreak"]= max
        
        console.log(putt);
      }else if(state==-1){
       
        putt["eventCurStreak"]= 0,         
        console.log(putt);
      }else{
        putt["eventCurStreak"]= act[0].eventCurStreak
        putt["eventMaxStreak"]= act[0].eventMaxrStreak
      }
      console.log(act[0])   
        axios
        .patch('/api/event/update/streak/'+act_id, putt)
        .then((res) => {
          console.log(res);
          this.$toast.info(`Cambio de estado exitoso`, { position: 'top-right' });
        })
        .catch((err) => console.log(err));
      
        this.forceRender()
      }

    },  
    nextDay(day){//day 0-6 dias de la semana .getDay()
      var now = new Date();    
      now.setDate(now.getDate() + (day+(7-now.getDay())) % 7);
      return now;
    },
    forceRender(){
      console.log("holsss", this.states.length)
      this.states.forEach(state => {
        state.key+=1;
        console.log(state.key)
      });
      
    },
    sampleActivities(){
      for (let index = 0; index < 5; index++) {
        this.activities.push({
          eventId: 15,
          eventName: 'x',
          eventStartDate: 'y',
          eventEndDate: 'z',
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
}