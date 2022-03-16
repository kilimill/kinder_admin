// export const URL = 'http://localhost:3000'
export const URL = process.env.VUE_APP_BACK_ENV === 'production' ? 'https://kinderdelice.afisha.ru' : 'https://kindercalendar.aaadev.ru'
