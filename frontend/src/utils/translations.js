export const translations = {
  en: {
    // Dashboard
    'Air Quality Overview': 'Air Quality Overview',
    'Real-time conditions and forecasts for your location': 'Real-time conditions and forecasts for your location',
    'Current Conditions': 'Current Conditions',
    'Pollutant Levels': 'Pollutant Levels',
    'Next 24 Hours': 'Next 24 Hours',
    'Temperature': 'Temperature',
    'Wind': 'Wind',
    'Humidity': 'Humidity',
    'Visibility': 'Visibility',
    'Health Recommendation': 'Health Recommendation',
    'Confidence': 'Confidence',
    
    // Settings
    'Settings': 'Settings',
    'Customize your Skyphoria experience': 'Customize your Skyphoria experience',
    'Appearance': 'Appearance',
    'Theme': 'Theme',
    'Dark': 'Dark',
    'Light': 'Light',
    'Units': 'Units',
    'Metric': 'Metric',
    'Imperial': 'Imperial',
    'Language': 'Language',
    'Notifications': 'Notifications',
    'Push Notifications': 'Push Notifications',
    'Email Notifications': 'Email Notifications',
    'SMS Notifications': 'SMS Notifications',
    
    // Units
    'Better for low light': 'Better for low light',
    'Coming soon...': 'Coming soon...',
  },
  es: {
    // Dashboard
    'Air Quality Overview': 'Resumen de Calidad del Aire',
    'Real-time conditions and forecasts for your location': 'Condiciones en tiempo real y pronósticos para su ubicación',
    'Current Conditions': 'Condiciones Actuales',
    'Pollutant Levels': 'Niveles de Contaminantes',
    'Next 24 Hours': 'Próximas 24 Horas',
    'Temperature': 'Temperatura',
    'Wind': 'Viento',
    'Humidity': 'Humedad',
    'Visibility': 'Visibilidad',
    'Health Recommendation': 'Recomendación de Salud',
    'Confidence': 'Confianza',
    
    // Settings
    'Settings': 'Configuración',
    'Customize your Skyphoria experience': 'Personaliza tu experiencia Skyphoria',
    'Appearance': 'Apariencia',
    'Theme': 'Tema',
    'Dark': 'Oscuro',
    'Light': 'Claro',
    'Units': 'Unidades',
    'Metric': 'Métrico',
    'Imperial': 'Imperial',
    'Language': 'Idioma',
    'Notifications': 'Notificaciones',
    'Push Notifications': 'Notificaciones Push',
    'Email Notifications': 'Notificaciones por Email',
    'SMS Notifications': 'Notificaciones SMS',
    
    // Units
    'Better for low light': 'Mejor para poca luz',
    'Coming soon...': 'Próximamente...',
  },
  fr: {
    // Dashboard
    'Air Quality Overview': 'Aperçu de la Qualité de l\'Air',
    'Real-time conditions and forecasts for your location': 'Conditions en temps réel et prévisions pour votre emplacement',
    'Current Conditions': 'Conditions Actuelles',
    'Pollutant Levels': 'Niveaux de Polluants',
    'Next 24 Hours': 'Prochaines 24 Heures',
    'Temperature': 'Température',
    'Wind': 'Vent',
    'Humidity': 'Humidité',
    'Visibility': 'Visibilité',
    'Health Recommendation': 'Recommandation de Santé',
    'Confidence': 'Confiance',
    
    // Settings
    'Settings': 'Paramètres',
    'Customize your Skyphoria experience': 'Personnalisez votre expérience Skyphoria',
    'Appearance': 'Apparence',
    'Theme': 'Thème',
    'Dark': 'Sombre',
    'Light': 'Clair',
    'Units': 'Unités',
    'Metric': 'Métrique',
    'Imperial': 'Impérial',
    'Language': 'Langue',
    'Notifications': 'Notifications',
    'Push Notifications': 'Notifications Push',
    'Email Notifications': 'Notifications Email',
    'SMS Notifications': 'Notifications SMS',
    
    // Units
    'Better for low light': 'Mieux pour faible luminosité',
    'Coming soon...': 'Bientôt disponible...',
  },
  de: {
    // Dashboard
    'Air Quality Overview': 'Luftqualitätsübersicht',
    'Real-time conditions and forecasts for your location': 'Echtzeit-Bedingungen und Vorhersagen für Ihren Standort',
    'Current Conditions': 'Aktuelle Bedingungen',
    'Pollutant Levels': 'Schadstoffwerte',
    'Next 24 Hours': 'Nächste 24 Stunden',
    'Temperature': 'Temperatur',
    'Wind': 'Wind',
    'Humidity': 'Feuchtigkeit',
    'Visibility': 'Sichtweite',
    'Health Recommendation': 'Gesundheitsempfehlung',
    'Confidence': 'Vertrauen',
    
    // Settings
    'Settings': 'Einstellungen',
    'Customize your Skyphoria experience': 'Passen Sie Ihr Skyphoria-Erlebnis an',
    'Appearance': 'Aussehen',
    'Theme': 'Thema',
    'Dark': 'Dunkel',
    'Light': 'Hell',
    'Units': 'Einheiten',
    'Metric': 'Metrisch',
    'Imperial': 'Imperial',
    'Language': 'Sprache',
    'Notifications': 'Benachrichtigungen',
    'Push Notifications': 'Push-Benachrichtigungen',
    'Email Notifications': 'E-Mail-Benachrichtigungen',
    'SMS Notifications': 'SMS-Benachrichtigungen',
    
    // Units
    'Better for low light': 'Besser bei wenig Licht',
    'Coming soon...': 'Demnächst...',
  }
}

export const useTranslation = (language = 'en') => {
  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key
  }
  
  return { t }
}
