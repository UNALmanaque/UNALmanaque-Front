import axios from 'axios';
import firebase from 'firebase';
export default {
  data() {
    return {
      id:0,
      activities: [],
      chartOptions2: {
        labels: ['Racha Actual']
        
      },
      series: [{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    /*chartOptions: {
      chart: {
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
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    },*/
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
    }
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
};