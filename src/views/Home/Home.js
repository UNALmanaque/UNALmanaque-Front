import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';

export default {
  data() {
    return {
      id:0,
      activities: [],
      user: {
        name: null,
        age: null,
        email: null,
      },
    };
  },
  created() {
    this.getUser();
    this.getActivities();
    this.filter();
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
        this.id = res.data.userId;
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
    getActivities() {
      console.log("Ativities")
      this.activities=[]
      axios
        .get('/api/event/find/'+this.id)
        .then((res) => {
          res.data.forEach(element => {
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
    filter() {
      
      let filtered= [];
      let current = new Date();
      
     //Filtro por dia 
        this.activities.forEach(activity => {
        let start = new Date(activity.eventStartDate)
        start.setDate(start.getDate() + 1);        
        let end = new Date(activity.eventEndDate)
        end.setDate(end.getDate() + 1);
        if(activity.eventDaily) {
          let skip=true //el forEach no tiene break >:c
          this.repetitionDates(start, end, activity.eventDaily).forEach(day => {
            if(Math.abs(current-day) < (1000 * 60 * 60 * 24) && skip){
            filtered.push(activity)
            skip=false
          }
          })
        }else {
          if(Math.abs(current-start) < (1000 * 60 * 60 * 24) || Math.abs(current-end) < (1000 * 60 * 60 * 24))
            filtered.push(activity)

        }
        

        })
        return filtered;
    },
    repetitionDates(start, end, eventDaily){ // AMMMMMMMMMMMM esto  es porque necesito todas las fechas de las actividades que se repiten para filtrarlas bien
      let dates = []
      eventDaily = this.fixEventDaily(eventDaily)
      let date=start;
      while((end-date)>=(1000 * 60 * 60 * 24)){
        let i
        date.getDay == 6 ?  i = 0 : i = date.getDay()-1
       
        if(eventDaily.charAt(i) == '1') {
          dates.push(new Date(date)) // LAS FECHAS SE MANDAN POR REFERENCIA !!! TE ODIO !!!
        }
        date.setDate(date.getDate() + 1);
      }
      return dates
    },
    fixEventDaily(eventDaily){
      
      eventDaily = eventDaily.toString()
      while(eventDaily.length<7){
        
        eventDaily = "0" +eventDaily
      }
      return eventDaily
    },
    onStart() {
      this.activeDrags++;
    },
    onStop() {
      this.activeDrags--;
    }

  },
};
