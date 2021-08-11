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
    currentFilter:0,
    filters: [
      {id: 0,
      name: "Todo"

      },{
      id: 1,
      name: "Día",
      },
      {id: 2,
      name: "Semana",
    },
      {id: 3,
      name: "Mes"
      }], 
      
    };
  },
  created() {
    
    this.getUserId();
    this.getActivities();
    console.log("see", this.states.length)
    this.getActivitiesUpdateDates();
    
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
          this.getActivitiesUpdateDates()
        }).catch(err=>{
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
            console.log("nombre:",element.eventName)
            console.log("curStreak:",element.eventCurStreak)
            console.log("lastDate:",element.eventLastDate)
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
    getActivitiesUpdateDates() {
      console.log("Update")
      axios
        .get('/api/event/find/'+this.id)
        .then((res) => {
          res.data.forEach(element => {
            this.nextDate(element.eventId,element.eventDaily.toString())//seteamos la proxima fecha de finalizacion
            this.stateFinalVerfication(element.eventId)
            console.log("holi")
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

      let putt = {
        "eventState": state,
        "eventId": act[0].id
        }

      if(state==2){
        putt["eventCurStreak"]= (act[0].eventCurStreak)+1
        putt["eventDays"]= (act[0].eventDays)+1
        let max
        if(act[0].eventMaxStreak<act[0].eventCurStreak+1 || act[0].eventMaxStreak== null){
          max = act[0].eventCurStreak+1
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
        putt["eventDays"]= act[0].eventDays     
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
    nextDate(act_id,week){// next date of completion day 0-6 dias de la semana .getDay()
      let act = this.activities.filter(activity => activity.eventId == act_id)

      var now = new Date();
      let numDay = now.getDay
      //if(numDay==0) numDay = 7
      for (numDay; numDay < week.length; numDay++) {
        if(week[numDay]=="1"){
          break
        }else if(numDay==6){
          numDay=0
          break
        }
      }
      now.setDate(now.getDate() + (numDay+(7-now.getDay())) % 7);
      //console.log("fecha:",now)
      
      let putt = {
        "eventLastDate": now,
        "eventId": act[0].id
      }

      axios
        .patch('/api/event/update/lastDate/'+act_id, putt)
        .then((res) => {
          console.log(res);
          //this.$toast.info(`Cambio de estado exitoso`, { position: 'top-right' });
        })
        .catch((err) => console.log(err));

    },
    stateFinalVerfication(act_id){
      let act = this.activities.filter(activity => activity.eventId == act_id)
      let now = new Date();
      let actDate = new Date(act[0].evenLastDay)
      //console.log("fechas:",now, actDate)
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
        //console.log(state.key)
      });
      
    },
    fixEventDaily(eventDaily){
      
      eventDaily = eventDaily.toString()
      while(eventDaily.length<7){
        
        eventDaily = "0" +eventDaily
      }
      return eventDaily
    },
    filter() {
      
      let filtered= [];
      let current = new Date();
      
      if(this.currentFilter==1) { //Filtro por dia 
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
      }
      else if(this.currentFilter==2){ //Filtro por semana (en realidad son 4 dias alrededor son las 4am no esperes mucho de mi.....)
        this.activities.forEach(activity => {
          let start = new Date(activity.eventStartDate)
          start.setDate(start.getDate() + 1);        
          let end = new Date(activity.eventEndDate)
          end.setDate(end.getDate() + 1);
          if(activity.eventDaily) {
            let skip=true //el forEach no tiene break >:c
            this.repetitionDates(start, end, activity.eventDaily).forEach(day => {
              if(Math.abs(current-day) < (1000 * 60 * 60 * 24 * 4) && skip){
              filtered.push(activity)
              skip=false
            }
            })
          }else {
            if(Math.abs(current-start) < (1000 * 60 * 60 * 24 * 4) || Math.abs(current-end) < (1000 * 60 * 60 * 24 * 4))
              filtered.push(activity)
  
          }
          
  
          })
      }
      else if (this.currentFilter==3){ //Filtro por mes
        let currentMonth = current.getMonth()
        console.log(currentMonth)
        this.activities.forEach(activity => {
          let start = new Date(activity.eventStartDate)
          start.setDate(start.getDate() + 1);        
          let end = new Date(activity.eventEndDate)
          end.setDate(end.getDate() + 1);

          if(activity.eventDaily) {
            let skip=true //el forEach no tiene break >:c
            this.repetitionDates(start, end, activity.eventDaily).forEach(day => {
              if(day.getMonth() == currentMonth && skip){
              filtered.push(activity)
              skip=false
            }
            })
          }else {
            
            if(start.getMonth() == currentMonth || end.getMonth() == currentMonth)
              filtered.push(activity)
  
          }
          
  
          })
      }
      else {
        this.getActivities()
        filtered=this.activities
      }
      this.activities=filtered
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