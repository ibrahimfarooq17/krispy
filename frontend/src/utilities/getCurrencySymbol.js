
const getCurrencySymbol = (currency) => {
  if (!currency || currency === "") return '$';
  else if (currency === 'EUR') return '€';
  else if (currency === 'USD') return '$';
  else if (currency === 'GBP') return '£';
  else return currency;
};

export default getCurrencySymbol;