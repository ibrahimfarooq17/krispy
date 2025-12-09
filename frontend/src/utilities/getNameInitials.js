const getInitials = (name) => {
  if (!name) return '';
  const initial = name[0].toUpperCase();
  return initial;
};

export default getInitials;
