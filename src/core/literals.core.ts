
/**
* The acceptable literal values of our custom
* VITE_* ENV variables.
*/
export const ECE_ENV =
{
  TRUE  : "TRUE",
  FALSE : "FALSE"
} as const;


/**
* Global configurations.
*
* These configurations are ENVIRONMENT GLOBAL.
* This means, that if you need a seperate
* configuration for development or production
* then USE environemnt variables instead!!!
*/
export const ECE_APP_CONFIG =
{
  USE_LANG_DETECTOR         : false,
  USE_LIGHT_AS_DEFAULT_THEME: true
} as const;

