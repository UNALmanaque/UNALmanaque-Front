import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';


export default {
  data() {
    return {
      activities: [],
      immutableActivities: [],
      categories: [],
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
    currentDateFilter:0,
    };
  },
  created() {
    
    this.getUserId();
    this.getActivities();
    this.getCategories();
    this.getActivitiesUpdateDates();
    
    //this.sampleActivities();
  },
  computed: {
    ...mapGetters(['authToken']),
    
    renderCategories() {
      return this.categories.map(category => {
        return {
          id: category.categoryId,
          name: category.categoryName
        }
      });
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
          this.getActivitiesUpdateDates()
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
            element.eventDaily.toString()
            this.activities.push(element);
            this.immutableActivities.push(element);
          });
        })
        .catch((err) => {
          console.log(err)
          this.$toast.error(err.response.data, { position: 'top-right' });
          setTimeout(this.$toast.clear, 3000);
        });
      
    },
    getCategories() {
      axios.get('/api/category')
      .then(response => {
         this.categories = response.data;
         this.categories.push({
          categoryId: 0,
          categoryName: "Seleccionar"
        })
      });
   },
    getActivitiesUpdateDates() {
      axios
        .get('/api/event/find/'+this.id)
        .then((res) => {
          res.data.forEach(element => {
            this.nextDate(element.eventId,element.eventDaily.toString())//seteamos la proxima fecha de finalizacion
            this.stateFinalVerfication(element.eventId)
          });
        })
        .catch((err) => {
          console.log(err)
          this.$toast.error(err.response.data, { position: 'top-right' });
          setTimeout(this.$toast.clear, 3000);
        });
      
    },
    deleteActivity(id){
      console.log('activity to delete: ', id);
      axios.delete('/api/event/delete/'+id)
      .then( res => {
        this.$toast.info(`Borrado exitoso`, { position: 'top-right' });
        console.log(res)
        this.activities= []
        this.getActivities()
        
      });
    },
    editActivity(activity, eventId){
      
      this.$router.push(`edit-activity?eventId=${eventId}`);
    },
    editState(act_id, state){
      if(state==-1){
        state=-1
      }else if(state==2){
        state=2
      }else { state=state+1
      this.activities.forEach(activity => {
        if(activity.eventId == act_id) activity.eventState = state;
      })
      let act = this.activities.filter(activity => activity.eventId == act_id)

      if(state==4){//debug No finalizar
        state=3;
      }else if(state==5){//debug Reiniciar
        state=4
      }

      let putt = {
        "eventState": state,
        "eventId": act[0].id
        }

      if(state==2){
        putt["eventCurStreak"]= (act[0].eventCurStreak)+1
        putt["eventDays"]= (act[0].eventDays)+1
        //Agregando al arreglo de fechas: 
        var now = new Date();
        let aux = {
          "eventLastDate": now,
        }
        axios
        .patch('/api/event/update/completed/'+act_id, aux)
        .then((res) => {
          console.log(res);
        })
        let max
        if(act[0].eventMaxStreak<act[0].eventCurStreak+1 || act[0].eventMaxStreak== null){
          max = act[0].eventCurStreak+1
        }else{
          max = act[0].eventMaxStreak
        }
        putt["eventMaxStreak"]= max
      }else if(state==3){
        putt["eventState"]= -1
        putt["eventCurStreak"]= 0 //verificar si no mandar todo da error     
        putt["eventMaxStreak"]= act[0].eventMaxStreak
        putt["eventDays"]= act[0].eventDays
      }else if(state==4){
        putt["eventState"]= 0//vuelve a por hacer
        putt["eventCurStreak"]= act[0].eventCurStreak //verificar si no mandar todo da error     
        putt["eventMaxStreak"]= act[0].eventMaxStreak
        putt["eventDays"]= act[0].eventDays
      }else{
        putt["eventCurStreak"]= act[0].eventCurStreak
        putt["eventMaxStreak"]= act[0].eventMaxStreak
        putt["eventDays"]= act[0].eventDays     
      }
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
    nextDate(act_id,week){// next date of completion day 0-6 dias de la semana .getDay()
      let act = this.activities.filter(activity => activity.eventId == act_id)
      var now = new Date(); 
      let numDay = now.getDay
      for (numDay; numDay < week.length; numDay++) {
        if(week[numDay]=="1"){
          break
        }else if(numDay==6){
          numDay=0
          break
        }
      }
      now.setDate(now.getDate() + (numDay+(7-now.getDay())) % 7);

      
      let putt = {
        "eventLastDate": now,
        "eventId": act[0].id
      }

      axios
        .patch('/api/event/update/lastDate/'+act_id, putt)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));

    },
    stateFinalVerfication(act_id){
      let act = this.activities.filter(activity => activity.eventId == act_id)
      let now = new Date();
      let actDate = new Date(act[0].evenLastDay)
      if(now>actDate){
        if(act[0].eventState==0 || act[0].eventState==1){
          this.editState(act_id,-1)
        }
      }
    },
    forceRender(){
      console.log("holsss", this.states.length)
      this.states.forEach(state => {
        state.key+=1;
      });
      
    },
    fixEventDaily(eventDaily){
      
      eventDaily = eventDaily.toString()
      while(eventDaily.length<7){
        
        eventDaily = "0" +eventDaily
      }
      return eventDaily
    },
    filterToday() {// filtro diario para actividades actuales
      let filtered= [];
      let current = new Date();
      current.setHours(19,0,0,0)

        this.activities.forEach(activity => {
        let start = new Date(activity.eventStartDate)
        start.setDate(start.getDate() + 1);        
        let end = new Date(activity.eventEndDate)
        end.setDate(end.getDate() + 1);
        if(activity.eventDaily != 0 && activity.eventDaily!= null) {
          let skip=true 
          this.repetitionDates(start, end, activity.eventDaily).forEach(day => {
            if(Math.abs(current-day) < (1000 * 60 * 60 * 24) && skip){
            filtered.push(activity)
            console.log("Day:",activity.eventName,day,current)
            skip=false
          }
          })
        }else {
          console.log("noweek")
          //if(Math.abs(current-start) <= (1000 * 60 * 60 * 24) || Math.abs(current-end) <= (1000 * 60 * 60 * 24))
            filtered.push(activity)
        }     

        })
      return filtered
    },
    repetitionDates(start, end, eventDaily){ 
      let dates = []
      eventDaily = this.fixEventDaily(eventDaily)
      let date=start;
      while((end-date)>=(1000 * 60 * 60 * 24)){
        let i
        date.getDay == 6 ?  i = 0 : i = date.getDay()-1
       
        if(eventDaily.charAt(i) == '1') {
          dates.push(new Date(date))
        }
        date.setDate(date.getDate() + 1);
      }
      return dates
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