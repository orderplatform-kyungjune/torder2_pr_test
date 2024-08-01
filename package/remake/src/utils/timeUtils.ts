import i18n from '@i18n';

const { t } = i18n.global;

export const getTime = (date: Date): string => {
  const zeroHours = `00${date.getHours()}`;
  const lastHourNumber = Number(zeroHours.slice(-2));
  const hours = lastHourNumber > 12 ? String(lastHourNumber - 12) : String(lastHourNumber);

  const zeroMinutes = `00${date.getMinutes()}`;
  const minutes = zeroMinutes.slice(-2);

  const zeroSeconds = `00${date.getSeconds()}`;
  const seconds = zeroSeconds.slice(-2);

  const time = {
    hours,
    minutes,
    seconds,
  };

  const isAfternoon = parseInt(zeroHours.slice(-2), 10) > 11;
  const getTypeMeridiemText = isAfternoon ? t('오후') : t('오전');
  const timeText = `${time.hours}:${time.minutes}:${time.seconds}`;
  const timeString = `${getTypeMeridiemText} ${timeText}`;

  return timeString;
};

export const getFullTime = (date: Date): string => {
  const zeroHours = `00${date.getHours()}`;
  const hours = Number(zeroHours.slice(-2));

  const zeroMinutes = `00${date.getMinutes()}`;
  const minutes = zeroMinutes.slice(-2);

  const zeroSeconds = `00${date.getSeconds()}`;
  const seconds = zeroSeconds.slice(-2);

  const time = {
    hours,
    minutes,
    seconds,
  };

  const timeText = `${time.hours}:${time.minutes}:${time.seconds}`;
  const timeString = String(timeText);

  return timeString;
};

export default {
  getTime,
  getFullTime,
};
