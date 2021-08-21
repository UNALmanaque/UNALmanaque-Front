import axios from 'axios';
import firebase from 'firebase';
export default {
  data() {
    return {
      id:0,
      activities: [],
      shownactivities:[],
      page: 1,
      num: 5,
      chartOptions2: {
        labels: ['Racha Actual'] 
      },
    };
  },
  created(){
    this.getUserId();
    this.getActivities();
  },
  methods: {
    getUserId(){
      const user = firebase.auth().currentUser;
      if(user){
        axios.get('/api/user/find/'+user.email)
        .then(response => {
          this.id = response.data.userId;
          this.getActivities()
        }).catch(err=>{
          this.$toast.error(err, { position: 'top-right' });
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
    getStreak(curStreak, maxStreak){
      let per
      maxStreak==0 || maxStreak == null? per = 0 : per = (curStreak/maxStreak)*100
     return [per];
    },
    filterNum:function (num, reset) {
      if(reset){
        this.page=1;
      }
      console.log(this.page)
      this.shownactivities= []
      this.num  = num;
      let last = this.page*this.num
      let first = last -this.num
    this.shownactivities = this.activities.slice(first, last)
  },
    prevP(){
      if(this.page>1){
        this.page=this.page-1       
      }
      this.filterNum(this.num)
    },
    nextP(){
      let max = Math.ceil(this.activities.length/this.num)
      
      if(this.page<max){
        this.page=this.page+1        
      }
      this.filterNum(this.num)
    },
    makeDaysChart(activity){
      let start = new Date(activity.eventStartDate)
      start.setDate(start.getDate() + 1); 
      let end = new Date(activity.eventEndDate)
      end.setDate(end.getDate() + 1);
      let ylabe = this.repetitionDates(start, end, activity.eventDaily, true)
      //if(activity.eventDaily){}
      let chartOptions = {
        chart : {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: name,
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ylabe,
        }
      }
      return chartOptions
    },
    makeSeriesChart(activity){
      let start = new Date(activity.eventStartDate)
      start.setDate(start.getDate() + 1); 
      let end = new Date(activity.eventEndDate)
      end.setDate(end.getDate() + 1);
      let dates = this.repetitionDates(start, end, activity.eventDaily, false)
      let rachas = []
      let completedDates = activity.eventCompletionList;
      console.log(completedDates)
      let i=0
      let contador=0
      dates.forEach(date => { 
        let date2 = new Date(completedDates[i]);
        date2.setDate(date2.getDate() + 1); 
        if (Math.abs(date2 - date) < (1000 * 60 * 60 * 24)) {
           contador = contador +1
          i= i+1
          console.log("mismo dia", date, date2)
        }
        else {
          contador=0
        }
        rachas.push(contador)
      })

     let series= [{
        name:"Racha",
        data: rachas
    }]
    return series
    },
   
    repetitionDates(start, end, eventDaily, label){ // AMMMMMMMMMMMM esto  es porque necesito todas las fechas de las actividades que se repiten para filtrarlas bien
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
      if(label) {
      let labels = dates.map(i => new Date(i).getDate().toString() + "/" +new Date(i).getMonth().toString());
      //current_datetime. + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
      return labels }
      return dates
    },
    fixEventDaily(eventDaily){
      eventDaily = eventDaily.toString()
      while(eventDaily.length<7){
        
        eventDaily = "0" +eventDaily
      }
      return eventDaily
    },
  
  },
  
};