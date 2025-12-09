// formats UTC timestamp to HH:MM AM/PM format
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours}:${minutes} ${ampm}`;
  return formattedTime;
};

export default formatTime;
