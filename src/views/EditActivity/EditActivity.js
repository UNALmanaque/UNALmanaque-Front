import axios from 'axios';
export default {
  data() {
    return {
      eventId: this.$route.query.eventId,
      activity: {
        eventId: 0,
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
      },
    };
  },
  created(){
    this.getActivity();
  },
  methods: {
    getActivity() {
      console.log(this.eventId);
      axios
        .get(`/api/event/find/${this.eventId}`)
        .then(res=>{
          this.activity = res.data;
        })
        .catch(err=> console.log(err));
    },
    editActivity() {
      axios
        .put(`api/event/editActivity`, {
          data: this.activity,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      this.$toast.info(`Editado exitoso`, { position: 'top-right' });
    },
  },
};
