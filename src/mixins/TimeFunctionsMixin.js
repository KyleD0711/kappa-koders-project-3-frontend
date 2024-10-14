export const TimeFunctionsMixin = {
  methods: {
    //Create time slots for users to select from
    generateTimeSlots(startTime, endTime, minLength) {
      let timeInterval = minLength;
      // get the total minutes between the start and end times.
      var totalMins = this.subtractTimes(startTime, endTime);

      // set the initial timeSlots array to just the start time
      var timeSlots = [startTime];

      // get the rest of the time slots.
      let generatedTimes = this.getTimeSlots(
        timeInterval,
        totalMins,
        timeSlots
      );

      let newTimeText = "";

      let times = [];
      for (let i = 0; i < generatedTimes.length; i++) {
        if (generatedTimes[i].length < 8)
          generatedTimes[i] = generatedTimes[i] + ":00";
        newTimeText = this.formatTimeFromString(generatedTimes[i]);
        times.push({
          time: generatedTimes[i],
          timeText: newTimeText,
        });
      }
      return times;
    },
    getTimeSlots(timeInterval, totalMins, timeSlots) {
      // base case - there are still more minutes
      if (totalMins - timeInterval >= 0) {
        // get the previous time slot to add interval to
        var prevTimeSlot = timeSlots[timeSlots.length - 1];
        // add timeInterval to previousTimeSlot to get nextTimeSlot
        var nextTimeSlot = this.addMinsToTime(timeInterval, prevTimeSlot);
        timeSlots.push(nextTimeSlot);

        // update totalMins
        totalMins -= timeInterval;

        // get next time slot
        return this.getTimeSlots(timeInterval, totalMins, timeSlots);
      } else {
        // all done!
        return timeSlots;
      }
    },
    subtractTimes(t2, t1) {
      // get each time's hour and min values
      var [t1Hrs, t1Mins] = this.getHoursAndMinsFromTime(t1);
      var [t2Hrs, t2Mins] = this.getHoursAndMinsFromTime(t2);

      // time arithmetic (subtraction)
      if (t1Mins < t2Mins) {
        t1Hrs--;
        t1Mins += 60;
      }
      var mins = t1Mins - t2Mins;
      var hrs = t1Hrs - t2Hrs;

      return hrs * 60 + mins;
    },
    getHoursAndMinsFromTime(time) {
      return time.split(":").map(function (str) {
        return parseInt(str);
      });
    },
    addMinsToTime(mins, time) {
      // get the times hour and min value
      var [timeHrs, timeMins] = this.getHoursAndMinsFromTime(time);

      // time arithmetic (addition)
      if (timeMins + mins >= 60) {
        var addedHrs = parseInt((timeMins + mins) / 60);
        timeMins = (timeMins + mins) % 60;
        if (timeHrs + addedHrs > 23) {
          timeHrs = (timeHrs + addedHrs) % 24;
        } else {
          timeHrs += addedHrs;
        }
      } else {
        timeMins += mins;
      }

      // make sure the time slots are padded correctly
      return (
        String("00" + timeHrs).slice(-2) +
        ":" +
        String("00" + timeMins).slice(-2)
      );
    },
    getLocalDateString() {
      let date = new Date();
      date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
      return date.toISOString().slice(0, 10);
    },
    roundToNearestInterval(date, groupTimeInterval) {
      const minutes = groupTimeInterval;
      const ms = 1000 * 60 * minutes;
      let newHours = Math.ceil(date.getTime() / ms) * ms;
      date.setTime(newHours);
      return date;
    },
    formatDate(date) {
      return (
        date.toString().substring(5, 10) + "-" + date.toString().substring(0, 4)
      );
    },
    formatReadableMonth(date) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      });
    },
    formatReadableDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    },
    formatReadableTimeFromSQL(time) {
      return new Date(time).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    },
    formatTimeFromString(time) {
      let modST = time.toString().substring(0, 2) % 12;
      let formattedTime = modST + ":" + time.toString().substring(3, 5);

      if (time.toString().substring(0, 2) > 12) {
        formattedTime = formattedTime + " PM";
      } else if (modST == 0 && time.toString().substring(0, 2) == "12") {
        formattedTime = "12:" + time.toString().substring(3, 5) + " PM";
      } else if (modST == 0) {
        formattedTime = "12:" + time.toString().substring(3, 5) + " AM";
      } else {
        formattedTime = formattedTime + " AM";
      }

      return formattedTime;
    },
    getPreviousSunday(date) {
      const previousSunday = new Date();
      previousSunday.setDate(date.getDate() - date.getDay());
      // if adding to new week makes the new date bigger than the previous date, subtract a month
      if (previousSunday > date)
        previousSunday.setMonth(previousSunday.getMonth() - 1);
      previousSunday.setHours(0, 0, 0, 0);
      return previousSunday;
    },
    getStartOfPreviousWeek() {
      let currentDate = this.getPreviousSunday(new Date());
      let previousStart = new Date(
        currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
      );
      return this.toSQLDate(previousStart);
    },
    getStartOfCurrentWeek() {
      let currentDate = this.getPreviousSunday(new Date());
      return this.toSQLDate(currentDate);
    },
    getStartOfNextWeek() {
      let currentDate = this.getPreviousSunday(new Date());
      let nextStart = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      return this.toSQLDate(nextStart);
    },
    toSQLDate(day) {
      var date = day.toISOString().slice(0, 19).replace("T", " ").slice(0, 10);
      return date;
    },
    checkHours(hours) {
      if (!hours || hours == 0) {
        return "---";
      }
      var total = this.toHoursAndMinutes(hours);
      return total;
    },
    numifyHours(hours) {
      if (!hours) {
        return 0;
      }
      var total = this.toHours(hours);
      return total;
    },
    toHours(totalMinutes) {
      var hours = parseFloat(totalMinutes) / parseFloat(60);
      return hours;
    },
    // https://stackoverflow.com/questions/36011227/javascript-check-if-time-ranges-overlap
    isOverlapping(a, b) {
      const getMinutes = (s) => {
        const p = s.split(":").map(Number);
        return p[0] + p[1] / 60;
      };
      console.log(getMinutes(a.startTime));
      console.log(getMinutes(a.endTime));
      console.log(getMinutes(b.startTime));
      console.log(getMinutes(b.endTime));

      return (
        getMinutes(a.endTime) > getMinutes(b.startTime) &&
        getMinutes(a.startTime) < getMinutes(b.endTime)
      );
    },
    toHoursAndMinutes(totalMinutes) {
      var minutes = parseInt(totalMinutes) % 60;
      minutes = (minutes < 10 ? "0" : "") + minutes;
      var hours = Math.floor(parseInt(totalMinutes) / 60);
      hours = (hours < 10 ? "0" : "") + hours;

      return hours + ":" + minutes;
    },
    setIsDatePast(appointment) {
      let checkDate = new Date();
      checkDate.setHours(
        checkDate.getHours() - checkDate.getTimezoneOffset() / 60
      );
      checkDate.setHours(0, 0, 0, 0);
      let checkTime = new Date();
      let tempHours = checkTime.getHours();
      // check minutes for group's booking buffer
      let tempMins = checkTime.getMinutes();
      if (appointment.group.bookPastMinutes > 0) {
        tempMins -= appointment.group.bookPastMinutes;
        while (tempMins < 0) {
          tempMins += 60;
          tempHours--;
        }
      } else if (appointment.group.bookPastMinutes < 0) {
        tempMins -= appointment.group.bookPastMinutes;
        while (tempMins > 59) {
          tempMins -= 60;
          tempHours++;
        }
      }
      let tempSecs = checkTime.getSeconds();
      if (tempHours < 10) {
        tempHours = "0" + tempHours;
      }
      if (tempMins < 10) {
        tempMins = "0" + tempMins;
      }
      if (tempSecs < 10) {
        tempSecs = "0" + tempSecs;
      }
      checkTime = tempHours + ":" + tempMins + ":" + tempSecs;
      if (appointment.date < checkDate.toISOString()) {
        appointment.isDatePast = true;
      } else if (checkDate.toISOString() === appointment.date) {
        if (checkTime > appointment.startTime) {
          appointment.isDatePast = true;
        } else appointment.isDatePast = false;
      } else {
        appointment.isDatePast = false;
      }
    },
  },
};
