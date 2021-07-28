<template>
  <div class="d-flex flex-column align-items-center">
    <h3>Crear activididad</h3>
    <div class="card col-10 col-md-6">
      <div class="card-header">
        <h5>Nueva Actividad:</h5>
      </div>
    </div>
    <div class="card col-10 col-md-6">
      <div class="card-body">
        <form class="activity-form" @submit.prevent="onSubmit">
          <label for="name">Nombre:</label>
          <input type="text" class="form-control" id="name" placeholder="Nombre Actividad" v-model="activity.name">
          <br>
          <div class="row mb-3">
              <div class="form-group col-4">
                <label for="start-date">Fecha inicial:</label>
                <input type="date" class="form-control" id="start-date" placeholder="" v-model="activity.startdate">
              </div>
              <div class="form-group col-4">
                <label for="end-date">Fecha final:</label>
                <input type="date" class="form-control" id="end-date" placeholder="" v-model="activity.enddate">
              </div>
              <div class="form-group col-4">
                <label for="color">Color:</label>
                <input type="color" class="form-control" id="color" placeholder="" v-model="activity.color">
              </div>
          </div>
           <div class="row mb-3">
              <div class="form-group col-4">
                <label for="priority">Prioridad:</label>
                <input type="number" class="form-control" id="priority" placeholder="0" v-model="activity.priority">
              </div>
              <div class="form-group col-8">
                <label for="category">Categoria:</label>
           <select class="form-control" v-model='activity.category'>
            <option v-for='data in activity.categories' :value='data.categoryId' :key='data.categoryId'>{{ data.categoryName }}</option> <!--toca cambiarlo cuando el get the categories funcione :c-->
            </select>
              </div>
              
           </div>
           <div class="row mb-3">
             <div class="form-group col-4">
                <br>
                <label for="repetition">Repetición:  <input type="checkbox" value="" v-model="activity.repetition"></label>
              </div>
              <div v-if=activity.repetition class="form-group col-4">
                <select class="select"  v-model="activity.days" multiple>
                  <option value=1000000>Lunes</option>
                  <option value=0100000>Martes</option>
                  <option value=0010000>Miercoles</option>
                  <option value=0001000>Jueves</option>
                  <option value=0000100>Viernes</option>
                  <option value=0000010>Sabado</option>
                  <option value=0000001>Domingo</option>
                <label class="form-label select-label">Dias</label>
</select>
              </div>
              <div class="form-group col-4">
                <label for="priority">Número de semanas:</label>
                <input type="number" class="form-control" id="weeks" placeholder="0" v-model="activity.week">
              </div>

           </div>
           
            <br>
            <button @click="createActivity" class="btn btn-primary">Crear</button>
        </form>
      </div>
    </div>
    </div>
</template>

<style scoped>
.activity-form .form-group{
  text-align: left;
}
</style>




<script>
import axios from 'axios';
import firebase from 'firebase';
export default {
  data() {
    return {
      activity: {
        name: null,
        startdate: null,
        enddate: null,
        color: null,
        category: null,
        priority: null,
        repetition: null,
        categories: [],
        week: null,
        daily:0,
        user: null,
        days: null
      },
    };
  },
  created: function(){
    this.getCategories();
    this.getCurrentUser();
  },
 
  
methods:{
  getCategories: function(){
      axios.get('/api/category')
      .then(response => {
         this.activity.categories = response.data;
         console.log(this.activity.categories[0].categoryId);
      });
   },
   getCurrentUser: function(){
     const user =firebase.auth().currentUser;
      if(user){
        console.log(user.email)

      axios.get('/api/user/find/'+user.email)
      .then(response => {
        this.activity.user = response.data;
        console.log(this.activity.user.userId)
      });
    }


      
   },
  createActivity: function(){
    if(this.activity.days){
    this.activity.days.forEach(day => {
      this.activity.daily += parseInt(day)
    });
    }
    let post = {
    "eventStartDate": this.activity.startdate,
    "eventEndDate": this.activity.enddate,
    "eventRep": this.activity.repetition,
    "eventName": this.activity.name,
    "eventColor": this.activity.color,
    "eventPriority": this.activity.priority,
    "eventDaily": this.activity.daily,
    "eventWeek": this.activity.week,
    "category": {
        "categoryId": this.activity.category
    },
    "eventState": 0,
    "eventCurStreak":0,
    "eventMaxStreak":0,
    "done":false,
    "user": {
        "userId": this.activity.user.userId
    }
    }
    
    
    
    
    if (
        this.activity.startdate &&
        this.activity.enddate &&
        this.activity.name 
        
      ){
        console.log(post)
        axios.post('/api/event', post)
      }
    this.$router.push('/activities')
  },
    

}
}
</script>