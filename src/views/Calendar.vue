<template>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">
  <div class="text-center section">
    <h1>Calendario de actividades</h1>
    <v-calendar
      v-if="!loading"
      class="custom-calendar max-w-full bg-gray-50"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden bg-gray-200 border-2 border-blue-50">
          <span class="day-label font-medium text-3xl text-gray-300 bg-gray-600 border-2 border-gray-200 ">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="(attr, index) in attributes"
              :id="attr.customData.id"
              :key="index"
              class="text-2xl text-white  leading-tight font-normal rounded-sm p-1 mt-0 mb-1"
              :style="`background: ${attr.customData.color};`"
              @click="handleActivityInfo"
            >
              {{ attr.customData.title }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
    <br />
    <div v-if="activity.title" class="row mb-3">
      <div class="col-5 col-md-4"></div>
      <div class="col-2 col-md-4">
        <br />
            <div class="card-header">
                <br />
                <h4> Detalles de Actividad </h4>
                </div>
                <div class="card-body">
                  <p><b>Titulo:</b> {{ activity.title }}</p>
                  <p><b>Racha Actual:</b> {{ activity.eventCurStreak }}</p>
                  <p><b>Racha Maxima:</b> {{ activity.eventMaxStreak }}</p>
                  <p><b>Categoria:</b> {{ activity.category }}</p>
                  <p><b>Prioridad:</b> {{ activity.priority }}</p>
                </div>
            
      </div>
      <div class="col-5 col-md-4"></div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase';
export default {
  created() {
    this.getUserId();
    this.getData();
    //this.getFakeData();
  },
  data() {
    return {
      masks: {
        weekdays: 'WWW',
      },
      attributes: [],
      loading: true,
      activity: {
        title: "",
        eventCurStreak: "",
        eventMaxStreak: "",
        priority: "",
        category: "",
        id: ""
      }
    };
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
          this.getData()
        }).catch(err=>{
          this.$toast.error(err.response.data, { position: 'top-right' });
          setTimeout(this.$toast.clear, 3000);
        });
      }
    },
    handleActivityInfo(e){
      let activity = this.attributes.find(attr => attr.customData.id == e.target.id);
      
      if(activity) {
         console.log("Activity info :", activity);
        this.activity = activity.customData;
      }
    },
    getWeekArray(activityDays) {
      let repetition = [];
      if (activityDays[6] == 1) {
        repetition.push(1);
      }
      if (activityDays[0] == 1) {
        repetition.push(2);
      }
      if (activityDays[1] == 1) {
        repetition.push(3);
      }
      if (activityDays[2] == 1) {
        repetition.push(4);
      }
      if (activityDays[3] == 1) {
        repetition.push(5);
      }
      if (activityDays[4] == 1) {
        repetition.push(6);
      }
      if (activityDays[5] == 1) {
        repetition.push(7);
      }
      return repetition;
    },
    getData() {
      axios
        .get('/api/event/find/'+this.id)
        .then((res) => {
          console.log("Response from Server: ", res);
          res.data.forEach((activity) => {
            this.attributes.push({
              customData: {
                title: activity.eventName,
                color: activity.eventColor,
                eventCurStreak: activity.eventCurStreak,
                eventMaxStreak: activity.eventMaxStreak,
                category: activity.category.categoryName,
                priority: activity.eventPriority,
                id: activity.eventId
              },
              dates: {
                start: activity.eventStartDate,
                end: activity.eventEndDate,
                weekdays: this.getWeekArray(activity.eventDaily.toString()),
              },
            });
          }); 
          this.loading = false;
        })
        .catch((err) => console.log(err));
    },
    getFakeData() {
      let fakeActivities = [
        {
          eventStartDate: new Date(2021, 6, 1),
          eventEndDate: new Date(2021, 6, 15),
          eventId: (Math.random() * 20).toFixed(),
          eventName: 'Activity 1',
          eventColor: 'red',
          eventPriority: 1,
          category: {
            categoryName: 'WTF',
          },
          eventDaily: '1010100',
          eventWeek: 4,
        },
        {
          eventStartDate: new Date(2021, 6, 1),
          eventEndDate: new Date(2021, 8, 1),
          eventId: (Math.random() * 20).toFixed(),
          eventName: 'Activity 2',
          eventColor: 'red',
          eventPriority: 1,
          category: {
            categoryName: 'WTF',
          },
          eventDaily: '0000011',
          eventWeek: 4,
        },
        {
          eventStartDate: new Date(2021, 6, 1),
          eventEndDate: new Date(2021, 8, 1),
          eventId: (Math.random() * 20).toFixed(),
          eventName: 'Activity 3',
          eventColor: 'pink',
          eventPriority: 1,
          category: {
            categoryName: 'WTF',
          },
          eventDaily: '1000000',
          eventWeek: 4,
        },
        {
          eventStartDate: new Date(2021, 6, 15),
          eventEndDate: new Date(2021, 6, 31),
          eventId: (Math.random() * 20).toFixed(),
          eventName: 'Activity 4',
          eventColor: 'green',
          eventPriority: 1,
          category: {
            categoryName: 'WTF',
          },
          eventDaily: '1110000',
          eventWeek: 4,
        },
      ];
      fakeActivities.forEach((activity) => {
        this.attributes.push({
          customData: {
            title: activity.eventName,
            class: `bg-${activity.eventColor}-600 text-white`,
          },
          dates: {
            start: activity.eventStartDate,
            end: activity.eventEndDate,
            weekdays: this.getWeekArray(activity.eventDaily),
          },
        });
      });
          this.loading = false;
    },
  },
};
</script>

<style lang="postcss" scoped>
::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  display: none;
}
/deep/ .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-width: 90px;
  --day-height: 90px;
  --weekday-bg: #b4b4b4;
  --weekday-border: 1px solid #eaeaea;
  border-radius: 0;
  width: 100%;
  & .vc-header {
    background-color: #f1f5f8;
    padding: 10px 0;
  }
  & .vc-weeks {
    padding: 0;
  }
  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }
  & .vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
    &.weekday-1,
    &.weekday-7 {
      background-color: #eff8ff;
    }
    &:not(.on-bottom) {
      border-bottom: var(--day-border);
      &.weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
    }
    &:not(.on-right) {
      border-right: var(--day-border);
    }
  }
  & .vc-day-dots {
    margin-bottom: 5px;
  }
  .text-xs {
    font-size: 4px;
    line-height: 1rem;
  }
}
</style>