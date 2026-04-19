# Asado today

## Intro
The app
- SHOULD help users decide whether or not it is a good day to make a BBQ in their current location.
- SHOULD automatically detect the user's location and the current date.
- SHOULD access the weather forecast for the selected location and date
IF it's not possible to automatically detect the location, the app SHOULD ask the user to manually input their location and date for which they want to get the recommendation. The default is the current day and location.
Based on this information, the app SHOULD provide a recommendation on whether it's a good day for BBQ or not. The recommendation should be based on various factors such as weather conditions, wind direction, and sunset time.

## Home screen
It consists of
- One small top bar with 3-letter day of the week, temperature, and a small weather icon and location, eg: Sun, 28ºC, 🌤️ Buenos Aires
- on one main button in the center of the screen which says: "Asado today?"
- Additionally, there's a small link text in the bottom of the screen to change the settings. The link says: "Another day or place?" and it takes the user to a screen where they can change the location and the date for which they want to get the recommendation. The default is the current day and location.

### The button
- is the main element on the screen
- Round shaped
- The user can click this right away, otherwise it has a (1/8) border with a progress bar that fills up clockwise in 10 seconds.
- on click or timeout, it switches to the recommendation screen.

### Detecting location
IF the app is unable to automatically detect the user's location
- it SHOULD automatically send the user to the settings screen
- AND it SHOULD prompt the user to manually input their location and date for which they want to get the recommendation.
