import { CountryEnum } from "../enum/CountryEnum";

export interface CreateAppointmentRequest {
  insuredId: string;
  scheduleId: number;
  date: string;
  countryISO: CountryEnum;
}