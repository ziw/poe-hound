import { I18nResolver } from 'i18n-ts';
import en from './en';

const messages = new I18nResolver({
  en,
  default: en,
}, "en").translation;

export default messages;
