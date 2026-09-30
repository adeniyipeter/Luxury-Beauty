import { appointmentService } from '../src/services/appointment.service';
import { authService } from '../src/services/auth.service';
import { prisma } from '../src/config/database';

async function runTests() {
  console.log('🧪 Starting Booking Conflict & Auth Verification Suite...');

  try {
    // 1. Verify Seeded Staff & Service
    const staff = await prisma.staffProfile.findFirst({
      where: { isActive: true },
      include: { user: true, services: true },
    });
    if (!staff) throw new Error('No staff found in database. Please run seed first.');

    const serviceId = staff.services[0]?.serviceId;
    if (!serviceId) throw new Error('Staff has no assigned services.');

    // 2. Fetch or create two distinct customers
    const customer1 = await authService.register({
      email: `test_cust_1_${Date.now()}@veya.com`,
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'Customer One',
    });

    const customer2 = await authService.register({
      email: `test_cust_2_${Date.now()}@veya.com`,
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'Customer Two',
    });

    console.log('✅ Created two test customers:', customer1.user.email, customer2.user.email);

    // 3. Customer 1 books an appointment on next Monday
    const nextDate = '2026-11-02'; // A Monday
    const timeSlot = '10:00';

    console.log(`📅 Customer 1 attempting to book staff ${staff.user.firstName} on ${nextDate} at ${timeSlot}...`);
    const booking1 = await appointmentService.bookAppointment(customer1.user.id, {
      serviceId,
      staffId: staff.id,
      date: nextDate,
      startTime: timeSlot,
      notes: 'First booking test',
    });

    console.log(`✅ Customer 1 booking SUCCESS: Ref ${booking1.appointmentNumber} (${booking1.startTime} - ${booking1.endTime})`);

    // 4. Customer 2 attempts to book the EXACT SAME staff member at the SAME time slot
    console.log(`📅 Customer 2 attempting to DOUBLE-BOOK same staff at ${timeSlot}...`);
    let conflictCaught = false;
    try {
      await appointmentService.bookAppointment(customer2.user.id, {
        serviceId,
        staffId: staff.id,
        date: nextDate,
        startTime: timeSlot,
        notes: 'Conflicting double booking attempt',
      });
    } catch (err: any) {
      conflictCaught = true;
      console.log(`🛡️ Conflict PREVENTED as expected! Error: "${err.message}" (Status ${err.statusCode})`);
    }

    if (!conflictCaught) {
      throw new Error('❌ CRITICAL FAILURE: Two customers were able to double-book the same staff member!');
    }

    // 5. Customer 2 attempts to book an OVERLAPPING slot (e.g., 30 mins into Customer 1's appointment)
    console.log(`📅 Customer 2 attempting to book OVERLAPPING slot at 10:30...`);
    let overlapCaught = false;
    try {
      await appointmentService.bookAppointment(customer2.user.id, {
        serviceId,
        staffId: staff.id,
        date: nextDate,
        startTime: '10:30',
        notes: 'Overlapping booking attempt',
      });
    } catch (err: any) {
      overlapCaught = true;
      console.log(`🛡️ Overlap PREVENTED as expected! Error: "${err.message}"`);
    }

    if (!overlapCaught) {
      throw new Error('❌ CRITICAL FAILURE: Overlapping slot was not rejected!');
    }

    // Clean up test bookings
    await prisma.appointment.delete({ where: { id: booking1.id } });
    await prisma.user.delete({ where: { id: customer1.user.id } });
    await prisma.user.delete({ where: { id: customer2.user.id } });

    console.log('\n🎉 ALL BOOKING CONFLICT & SECURITY TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
