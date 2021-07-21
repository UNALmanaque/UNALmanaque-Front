<template>
  <div class="text-center section">
    <h2 class="h2">My Calendar</h2>
    <p class="text-lg font-medium text-gray-600 mb-6">
      Activities Calendar
    </p>
    <v-calendar
      class="custom-calendar max-w-full"
      :masks="masks"
      :attributes="attributes"
      disable-page-swipe
      is-expanded
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="flex flex-col h-full z-10 overflow-hidden">
          <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
          <div class="flex-grow overflow-y-auto overflow-x-auto">
            <p
              v-for="(attr, index) in attributes"
              :key="index"
              class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
              :class="attr.customData.class"
            >
              {{ attr.customData.title }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  created() {
    // this.getData();
    this.getFakeData();
  },
  data() {
    return {
      masks: {
        weekdays: 'WWW',
      },
      attributes: [],
    };
  },
  methods: {
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
        .get('/api/event/find/0')
        .then((res) => {
          res.data.forEach((activity) => {
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
  --weekday-bg: #f8fafc;
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
}
</style>
