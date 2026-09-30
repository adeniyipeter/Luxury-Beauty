import { Injectable, signal, computed } from '@angular/core';
import { Service, StaffProfile, TimeSlot, Appointment } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookingStateService {
  // Booking Wizard Signals
  currentStep = signal<number>(1);
  selectedService = signal<Service | null>(null);
  selectedStaff = signal<StaffProfile | null>(null);
  selectedDate = signal<string>('');
  selectedTime = signal<string>('');
  notes = signal<string>('');
  promoCode = signal<string>('');
  paymentMethod = signal<string>('PAY_AT_SALON');
  confirmedAppointment = signal<Appointment | null>(null);

  isStep1Valid = computed(() => !!this.selectedService());
  isStep2Valid = computed(() => !!this.selectedStaff());
  isStep3Valid = computed(() => !!this.selectedDate() && !!this.selectedTime());

  setService(service: Service) {
    this.selectedService.set(service);
    // If staff already selected doesn't perform this service, reset staff
    const staff = this.selectedStaff();
    if (staff && service.staffMembers) {
      const match = service.staffMembers.some((s) => s.staff.id === staff.id);
      if (!match) {
        this.selectedStaff.set(null);
      }
    }
  }

  setStaff(staff: StaffProfile) {
    this.selectedStaff.set(staff);
    this.selectedTime.set(''); // reset time if staff changes
  }

  setDateTime(date: string, time: string) {
    this.selectedDate.set(date);
    this.selectedTime.set(time);
  }

  reset() {
    this.currentStep.set(1);
    this.selectedService.set(null);
    this.selectedStaff.set(null);
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.notes.set('');
    this.promoCode.set('');
    this.confirmedAppointment.set(null);
  }
}
