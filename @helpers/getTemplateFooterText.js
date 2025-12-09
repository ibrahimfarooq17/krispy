const getTemplateFooterText = (language) => {
  if (language === "fr")
    return "Pour vous désinscrire, répondez en envoyant STOP.";
  else if (language == "en_US")
    return "To unsubscribe, reply with STOP.";
  else if (language == "de")
    return "Zum Abmelden mit STOP antworten.";
  else
    return "To unsubscribe, reply with STOP.";
};

module.exports = getTemplateFooterText;