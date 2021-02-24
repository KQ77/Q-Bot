function convertTime(time) {
  let hour = time.slice(0, 2);
  let newHour = (hour * 1 + 5).toString() + ':00';
  let date = new Date().toISOString();
  date = date.slice(0, 11) + newHour + ':00.00Z';
  date = new Date(date);
  date = Date.parse(date);
  return date / 1000;
}

console.log(convertTime(`17:00`));

module.exports = { convertTime };

//if time is 17:00 for us, it will come out to be //12:00 our time
