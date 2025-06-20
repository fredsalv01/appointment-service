import { CreateAppointmentUseCase } from "../../../application/createAppointment.use-case";
import { CountryEnum } from "../../../application/enum/CountryEnum";
import { AppointmentRepository } from "../../../domain/appointment.repository";
import {describe, it, expect, vi, beforeEach} from 'vitest'


const mockRepo: AppointmentRepository = {
    save: vi.fn(),
    findByInsuredId: vi.fn(),
    updateStatus: vi.fn(),
    findById: vi.fn()
}

describe('CreateAppointmentUseCase', () => {
    let useCase: CreateAppointmentUseCase;

    beforeEach(() => {
        useCase = new CreateAppointmentUseCase(mockRepo);
    })

    it('should save a valid appointment', async () => {
    const appointment = {
      insuredId: '01234',
      scheduleId: 100,
      countryISO: CountryEnum.PE,
      date: '2025-09-30T12:30:00Z',
      status: 'pending',
    };

    await useCase.execute(appointment);

    expect(mockRepo.save).toHaveBeenCalledWith(appointment);
  });
})