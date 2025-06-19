import { CountryEnum } from "../../../application/enum/CountryEnum";
import {z} from 'zod'
export const createAppointmentSchema = z.object({
  insuredId: z.string().regex(/^\d{5}$/, 'El campo insuredId debe tener 5 digitos'),
  scheduleId: z.number().int().positive(),
  date: z.string(),
  countryISO: z.enum([CountryEnum.PE, CountryEnum.CL]),
});