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
        daily: 0,
        user: null,
        days: null,
      },
    };
  },
  methods: {
    editActivity: function(){
      this.$toast.info(`Editado exitoso`, { position: 'top-right' });
    }
  },
};
