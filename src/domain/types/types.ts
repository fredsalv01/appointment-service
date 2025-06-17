import { StatusEnum } from "./enums/enums";

export interface Appointment {
  id: string;
  insuredId: string;
  date: string;
  status: StatusEnum;
}