import { expect, vi } from "vitest";
import { AppointmentRepository } from "../../../domain/appointment.repository";
import { GetAppointmentsByInsuredIdUseCase } from "../../../application/getAppointment.use-case";
import { beforeEach, describe, it } from "node:test";


const mockRepo: AppointmentRepository = {
    save: vi.fn(),
    findByInsuredId: vi.fn(),
    updateStatus: vi.fn(),
    findById: vi.fn()
}

describe('GetAppointmentsByInsuredIdUseCase', () => {
  let useCase: GetAppointmentsByInsuredIdUseCase;

  beforeEach(() => {
    useCase = new GetAppointmentsByInsuredIdUseCase(mockRepo);
  });

  it('should return appointments for a given insuredId', async () => {
    const mockAppointments = [
      { insuredId: '01234', scheduleId: 1, status: 'pending' },
    ];

    (mockRepo.findByInsuredId as any).mockResolvedValue(mockAppointments);

    const result = await useCase.execute('01234');

    expect(result).toEqual(mockAppointments);
    expect(mockRepo.findByInsuredId).toHaveBeenCalledWith('01234');
  });
});