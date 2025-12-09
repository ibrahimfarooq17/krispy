function formatNumber(number) {
  const parts = number.toString().split(".");

  // Format the integer part with commas after every 3 digits
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
}

export default formatNumber;
