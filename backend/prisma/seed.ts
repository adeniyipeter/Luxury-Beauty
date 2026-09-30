import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Veya Beauty Studio database...');

  // 1. Salon Settings
  const settings = [
    { key: 'salon_name', value: 'Veya Beauty Studio', description: 'Salon official name' },
    { key: 'salon_tagline', value: 'Beautiful Hair. Beautiful You.', description: 'Salon tagline' },
    { key: 'salon_address', value: '14 Victoria Island Boulevard, Lagos, Nigeria', description: 'Physical address' },
    { key: 'salon_phone', value: '+234 801 234 5678', description: 'Primary phone' },
    { key: 'salon_email', value: 'bookings@veyastudio.com', description: 'Contact email' },
    { key: 'salon_currency', value: '₦', description: 'Salon currency symbol' },
    { key: 'salon_timezone', value: 'Africa/Lagos', description: 'Salon timezone' },
    { key: 'salon_hours', value: 'Mon - Sat: 9:00 AM - 7:00 PM | Sun: 12:00 PM - 6:00 PM', description: 'Operating hours' },
    { key: 'skin_bleaching_enabled', value: 'true', description: 'Allow skin toning/bleaching booking with disclaimer' },
  ];

  for (const s of settings) {
    await prisma.salonSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  // 2. Categories
  const categoriesData = [
    {
      name: 'Hair Services',
      slug: 'hair-services',
      description: 'Expert styling, braiding, silk press, treatments, and luxurious wig installations.',
      imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      sortOrder: 1,
    },
    {
      name: 'Nail Services',
      slug: 'nail-services',
      description: 'Pristine manicures, pedicures, custom gel art, acrylic extensions, and cuticle care.',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      sortOrder: 2,
    },
    {
      name: 'Skin & Beauty',
      slug: 'skin-and-beauty',
      description: 'Rejuvenating facials, expert glam makeup, gentle waxing, threading, and exfoliations.',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      sortOrder: 3,
    },
    {
      name: 'Other Services',
      slug: 'other-services',
      description: 'Eyelash extensions, bridal packages, relaxing massages, and gentle kids hair care.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      sortOrder: 4,
    },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created.id;
  }

  // 3. Services (From task.md)
  const servicesData = [
    // Hair Services
    {
      categoryId: categories['hair-services'],
      name: 'Weaving & Braiding (Box Braids & Knotless)',
      slug: 'box-braids-knotless',
      description: 'Clean, tension-free knotless box braids or traditional cornrows tailored to your style and length preference.',
      durationMinutes: 180,
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
      preparation: 'Wash hair 24 hours prior or add our deep wash service. Come with detangled hair.',
      aftercare: 'Moisturize scalp daily with tea tree/argan oil. Sleep with a satin bonnet.',
    },
    {
      categoryId: categories['hair-services'],
      name: 'Wig Making, Fixing & Revamping',
      slug: 'wig-making-fixing-revamping',
      description: 'Custom lace closure/frontal wig customization, bleach knots, plucking, and seamless melt installation.',
      durationMinutes: 120,
      price: 20000,
      imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
      preparation: 'Drop off wig 48 hours in advance for custom coloring or plucking if needed.',
      aftercare: 'Avoid heavy oils around the lace perimeter. Wrap edges with melt band after showers.',
    },
    {
      categoryId: categories['hair-services'],
      name: 'Silk Press & Thermal Styling',
      slug: 'silk-press-thermal-styling',
      description: 'Hydro-steam deep treatment followed by precision blow dry and feather-light titanium silk press with incredible bounce.',
      durationMinutes: 90,
      price: 18000,
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      preparation: 'Arrive free from heavy oils and grease.',
      aftercare: 'Protect from humidity and steam. Wrap tightly at bedtime in silk scarf.',
    },
    {
      categoryId: categories['hair-services'],
      name: 'Hair Washing, Conditioning & Deep Treatment',
      slug: 'hair-washing-deep-treatment',
      description: 'Clarifying detox shampoo, moisturizing protein mask under a warm steamer, and stimulating scalp massage.',
      durationMinutes: 60,
      price: 12000,
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      preparation: 'None required.',
      aftercare: 'Drink plenty of water and avoid heat styling for 48 hours.',
    },
    {
      categoryId: categories['hair-services'],
      name: 'Hair Relaxing / Texturizing (Perming)',
      slug: 'hair-relaxing-texturizing',
      description: 'Professional virgin relaxer or retouch with scalp protection, pH-neutralizing wash, and restorative protein glaze.',
      durationMinutes: 90,
      price: 16000,
      imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
      preparation: 'Do not scratch or wash scalp for at least 72 hours prior to service.',
      aftercare: 'Wait 7 days before shampooing. Keep hair hydrated with leave-in conditioner.',
    },
    {
      categoryId: categories['hair-services'],
      name: 'Hair Coloring & Dyeing',
      slug: 'hair-coloring-dyeing',
      description: 'Single-process all-over color, balayage highlights, or root touch-ups using premium bond-protecting formulas.',
      durationMinutes: 120,
      price: 28000,
      imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      preparation: 'Patch test required for first-time color clients 24 hours in advance.',
      aftercare: 'Use sulfate-free color-safe shampoo and rinse with cool water.',
    },
    {
      categoryId: categories['hair-services'],
      name: 'Hair Cutting, Trimming & Shaping',
      slug: 'hair-cutting-trimming',
      description: 'Precision split-end dusting, perimeter shape-up, or full transformation cut tailored to your face shape.',
      durationMinutes: 45,
      price: 10000,
      imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
      preparation: 'Come with clean, detangled, blown-out hair.',
      aftercare: 'Re-trim every 8-12 weeks to maintain healthy ends.',
    },
    {
      categoryId: categories['hair-services'],
      name: 'Dreadlocks / Loc Maintenance & Retwist',
      slug: 'dreadlocks-loc-maintenance',
      description: 'Clarifying ACV detox rinse, organic palm rolling retwist, interlock repair, and hooded dryer set.',
      durationMinutes: 120,
      price: 18000,
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      preparation: 'No heavy wax or grease build-up before appointment.',
      aftercare: 'Keep locs dry for first 48 hours; mist lightly with rosewater/aloe.',
    },

    // Nail Services
    {
      categoryId: categories['nail-services'],
      name: 'Deluxe Spa Pedicure',
      slug: 'deluxe-spa-pedicure',
      description: 'Dead sea salt soak, organic lavender scrub, callous smoothing, cuticle grooming, massage, and gel polish.',
      durationMinutes: 60,
      price: 15000,
      imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
      preparation: 'Wear open-toed shoes if opting for regular polish.',
      aftercare: 'Apply cuticle oil daily and moisturize feet before bed.',
    },
    {
      categoryId: categories['nail-services'],
      name: 'Full Set Acrylic Nails & Custom Art',
      slug: 'acrylic-nails-full-set',
      description: 'Flawless acrylic nail extensions with custom shaping (coffin, almond, stiletto) and hand-painted nail art.',
      durationMinutes: 90,
      price: 22000,
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      preparation: 'Remove existing enhancements or add a soak-off service to booking.',
      aftercare: 'Wear gloves during harsh cleaning chemicals. Refill every 2-3 weeks.',
    },
    {
      categoryId: categories['nail-services'],
      name: 'Russian Gel Manicure',
      slug: 'russian-gel-manicure',
      description: 'Dry e-file precision cuticle alignment, rubber base coat reinforcement, and high-shine gel color.',
      durationMinutes: 60,
      price: 14000,
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      preparation: 'Avoid trimming cuticles at home before appointment.',
      aftercare: 'Do not use nails as tools. Apply solar oil twice daily.',
    },

    // Skin & Beauty
    {
      categoryId: categories['skin-and-beauty'],
      name: 'Hydra-Glow Deep Cleansing Facial',
      slug: 'hydra-glow-facial',
      description: 'Ultrasonic pore cleansing, gentle enzyme peel, steam extraction, high-frequency antibacterial therapy, and hyaluronic infusion.',
      durationMinutes: 75,
      price: 25000,
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      preparation: 'Discontinue retinol or strong acids 3 days prior.',
      aftercare: 'Apply SPF 50 daily. Avoid sauna and heavy sweating for 24 hours.',
    },
    {
      categoryId: categories['skin-and-beauty'],
      name: 'Glamour Makeup Application (Bridal & Event)',
      slug: 'glamour-makeup-application',
      description: 'Flawless camera-ready skin prep, airbrush finish, sculpted brows, dramatic mink lashes, and long-wear setting mist.',
      durationMinutes: 75,
      price: 30000,
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      preparation: 'Arrive with a freshly washed, moisturized face and clean brows.',
      aftercare: 'Remove with oil cleanser followed by gentle foaming cleanser.',
    },
    {
      categoryId: categories['skin-and-beauty'],
      name: 'Full Body Exfoliating Glow Scrub',
      slug: 'body-scrub-exfoliation',
      description: 'Himalayan pink salt and sweet almond oil whole-body buffing, warm vichy rinse, and nourishing shea butter massage.',
      durationMinutes: 60,
      price: 24000,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      preparation: 'Do not shave or wax within 24 hours of body scrub.',
      aftercare: 'Moisturize skin with rich body butter twice daily.',
    },
    {
      categoryId: categories['skin-and-beauty'],
      name: 'Skin Brightening & Toning Therapy',
      slug: 'skin-brightening-toning-treatment',
      description: 'Dermatologically formulated antioxidant treatment with Vitamin C and kojic acid targeting hyperpigmentation and uneven tone.',
      durationMinutes: 60,
      price: 28000,
      imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f02e6a0d244?auto=format&fit=crop&w=800&q=80',
      preparation: 'Avoid direct sun exposure and tanning 48 hours prior.',
      aftercare: 'Strict sunscreen application is required. Do not use peeling agents.',
      isDisclaimerRequired: true,
      disclaimerText: 'Notice: This aesthetic service is designed exclusively for hyperpigmentation correction and skin tone balancing. We do not use prohibited chemical bleaching agents (e.g. mercury, hydroquinone > 2%). Clients must adhere strictly to sun protection guidelines.',
    },

    // Other Services
    {
      categoryId: categories['other-services'],
      name: 'Veya Ultimate Bridal Luxury Package',
      slug: 'bridal-luxury-package',
      description: 'Complete royal treatment: Bridal hair trial & wedding day installation, HD glam makeup, bridal manicure & pedicure, and champagne spa treatment.',
      durationMinutes: 240,
      price: 85000,
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      preparation: 'Schedule a pre-consultation at least 2 weeks before the big day.',
      aftercare: 'Touch-up kit provided with setting powder and custom lipstick.',
    },
    {
      categoryId: categories['other-services'],
      name: 'Volume Russian Eyelash Extensions',
      slug: 'volume-eyelash-extensions',
      description: 'Handmade fans of ultra-lightweight silk lashes applied individually for a full, fluttery, dramatic look.',
      durationMinutes: 90,
      price: 20000,
      imageUrl: 'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=800&q=80',
      preparation: 'Arrive free from eye makeup, oils, or waterproof mascara.',
      aftercare: 'Keep lashes completely dry for 24 hours. Brush daily with spoolie.',
    },
    {
      categoryId: categories['other-services'],
      name: 'Therapeutic Neck, Shoulder & Head Massage',
      slug: 'therapeutic-massage',
      description: 'Targeted acupressure and aromatherapy tension relief to unknot stressed muscles and promote deep relaxation.',
      durationMinutes: 45,
      price: 15000,
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      preparation: 'Wear comfortable clothing.',
      aftercare: 'Hydrate with warm herbal water.',
    },
    {
      categoryId: categories['other-services'],
      name: 'Kids Gentle Hair Styling & Braiding',
      slug: 'kids-hair-styling',
      description: 'Tear-free gentle detangling, playful beads or ribbon cornrows, and lightweight scalp conditioning for kids aged 3-12.',
      durationMinutes: 90,
      price: 12000,
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      preparation: 'Bring your child’s favorite toy or iPad for entertainment.',
      aftercare: 'Maintain with kid-safe leave-in conditioner.',
    },
  ];

  const servicesMap: Record<string, string> = {};
  for (const s of servicesData) {
    const created = await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
    servicesMap[s.slug] = created.id;
  }

  // 4. Users (Admin, Staff, Customer)
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@veya.com' },
    update: {},
    create: {
      email: 'admin@veya.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      firstName: 'Ayuba',
      lastName: 'Veya',
      phone: '+234 800 111 2222',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  // Staff 1 - Ngozi Adeleke (Hair)
  const staffUser1 = await prisma.user.upsert({
    where: { email: 'ngozi@veya.com' },
    update: {},
    create: {
      email: 'ngozi@veya.com',
      passwordHash,
      role: 'STAFF',
      firstName: 'Ngozi',
      lastName: 'Adeleke',
      phone: '+234 802 333 4444',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  });

  const staffProfile1 = await prisma.staffProfile.upsert({
    where: { userId: staffUser1.id },
    update: {},
    create: {
      userId: staffUser1.id,
      title: 'Senior Hair Artist & Braiding Master',
      bio: 'Award-winning hairstylist with 8+ years specializing in tension-free knotless braiding, flawless wig installs, and protective styles.',
      specialty: 'Hair Weaving, Braids & Silk Press',
      rating: 4.95,
      experienceYears: 8,
    },
  });

  // Staff 2 - Amina Yusuf (Nails & Esthetics)
  const staffUser2 = await prisma.user.upsert({
    where: { email: 'amina@veya.com' },
    update: {},
    create: {
      email: 'amina@veya.com',
      passwordHash,
      role: 'STAFF',
      firstName: 'Amina',
      lastName: 'Yusuf',
      phone: '+234 803 555 6666',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
  });

  const staffProfile2 = await prisma.staffProfile.upsert({
    where: { userId: staffUser2.id },
    update: {},
    create: {
      userId: staffUser2.id,
      title: 'Lead Nail Artist & Lash Specialist',
      bio: 'Certified Russian manicure technician and master nail artist with passion for intricate 3D designs, structure gel, and Russian volume lashes.',
      specialty: 'Russian Gel Nails & Lash Extensions',
      rating: 4.9,
      experienceYears: 6,
    },
  });

  // Staff 3 - Chidinma Okafor (Skin, Makeup & Bridal)
  const staffUser3 = await prisma.user.upsert({
    where: { email: 'chidinma@veya.com' },
    update: {},
    create: {
      email: 'chidinma@veya.com',
      passwordHash,
      role: 'STAFF',
      firstName: 'Chidinma',
      lastName: 'Okafor',
      phone: '+234 804 777 8888',
      avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80',
    },
  });

  const staffProfile3 = await prisma.staffProfile.upsert({
    where: { userId: staffUser3.id },
    update: {},
    create: {
      userId: staffUser3.id,
      title: 'Senior Esthetician & Bridal MUA',
      bio: 'Licensed skin therapist and celebrity makeup artist specializing in hyperpigmentation treatment, Hydra-facials, and bridal transformations.',
      specialty: 'Hydra-Facials, Skin Toning & Bridal Makeup',
      rating: 5.0,
      experienceYears: 7,
    },
  });

  // Customer
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@veya.com' },
    update: {},
    create: {
      email: 'customer@veya.com',
      passwordHash,
      role: 'CUSTOMER',
      firstName: 'Folashade',
      lastName: 'Balogun',
      phone: '+234 805 999 0000',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
  });

  await prisma.customerProfile.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      address: 'Plot 22 Admiralty Way, Lekki Phase 1, Lagos',
      notes: 'Prefers gentle scalp tension and peppermint essential oils.',
      loyaltyPoints: 150,
    },
  });

  // 5. Staff Services Assignment
  const hairServices = [
    'box-braids-knotless',
    'wig-making-fixing-revamping',
    'silk-press-thermal-styling',
    'hair-washing-deep-treatment',
    'hair-relaxing-texturizing',
    'hair-coloring-dyeing',
    'hair-cutting-trimming',
    'dreadlocks-loc-maintenance',
    'kids-hair-styling',
    'bridal-luxury-package',
  ];

  for (const s of hairServices) {
    if (servicesMap[s]) {
      await prisma.staffService.upsert({
        where: {
          staffProfileId_serviceId: {
            staffProfileId: staffProfile1.id,
            serviceId: servicesMap[s],
          },
        },
        update: {},
        create: {
          staffProfileId: staffProfile1.id,
          serviceId: servicesMap[s],
        },
      });
    }
  }

  const nailAndLashServices = [
    'deluxe-spa-pedicure',
    'acrylic-nails-full-set',
    'russian-gel-manicure',
    'volume-eyelash-extensions',
    'therapeutic-massage',
    'bridal-luxury-package',
  ];

  for (const s of nailAndLashServices) {
    if (servicesMap[s]) {
      await prisma.staffService.upsert({
        where: {
          staffProfileId_serviceId: {
            staffProfileId: staffProfile2.id,
            serviceId: servicesMap[s],
          },
        },
        update: {},
        create: {
          staffProfileId: staffProfile2.id,
          serviceId: servicesMap[s],
        },
      });
    }
  }

  const skinAndBeautyServices = [
    'hydra-glow-facial',
    'glamour-makeup-application',
    'body-scrub-exfoliation',
    'skin-brightening-toning-treatment',
    'bridal-luxury-package',
    'therapeutic-massage',
  ];

  for (const s of skinAndBeautyServices) {
    if (servicesMap[s]) {
      await prisma.staffService.upsert({
        where: {
          staffProfileId_serviceId: {
            staffProfileId: staffProfile3.id,
            serviceId: servicesMap[s],
          },
        },
        update: {},
        create: {
          staffProfileId: staffProfile3.id,
          serviceId: servicesMap[s],
        },
      });
    }
  }

  // 6. Staff Availabilities (Monday through Saturday, 09:00 - 18:00)
  const staffProfiles = [staffProfile1, staffProfile2, staffProfile3];
  for (const sp of staffProfiles) {
    for (let day = 1; day <= 6; day++) {
      await prisma.staffAvailability.upsert({
        where: {
          staffProfileId_dayOfWeek: {
            staffProfileId: sp.id,
            dayOfWeek: day,
          },
        },
        update: { startTime: '09:00', endTime: '18:00', isWorking: true },
        create: {
          staffProfileId: sp.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '18:00',
          isWorking: true,
        },
      });
    }
  }

  // 7. Gallery Images
  const galleryItems = [
    {
      title: 'Boho Knotless Goddess Braids with Curls',
      category: 'Hair',
      imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
      description: 'Waist-length human hair curly ends in shade 1B.',
      isFeatured: true,
    },
    {
      title: 'HD Lace Frontal Wig Melt',
      category: 'Hair',
      imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
      description: 'Invisible lace melt on 26-inch bone straight raw hair.',
      isFeatured: true,
    },
    {
      title: 'Emerald Green Abstract French Acrylics',
      category: 'Nails',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      description: 'Coffin shape with 24k gold leaf accents and high gloss gel.',
      isFeatured: true,
    },
    {
      title: 'Bridal Traditional Yoruba & White Wedding Glam',
      category: 'Bridal',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      description: 'Luminous glowing skin and soft sculpted smokey eye.',
      isFeatured: true,
    },
    {
      title: 'Post Hydra-Glow Facial Radiance',
      category: 'Beauty',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      description: 'Glass skin finish after ultrasonic extraction and hyaluronic infusion.',
      isFeatured: true,
    },
    {
      title: 'Wispy Russian Mega Volume Lashes',
      category: 'Other',
      imageUrl: 'https://images.unsplash.com/photo-1583001809873-a128495da465?auto=format&fit=crop&w=800&q=80',
      description: 'Cat-eye mapping 10-15mm curl for all-day eye drama.',
      isFeatured: false,
    },
  ];

  for (const g of galleryItems) {
    const existing = await prisma.galleryImage.findFirst({ where: { title: g.title } });
    if (!existing) {
      await prisma.galleryImage.create({ data: g });
    }
  }

  // 8. Promotions
  await prisma.promotion.upsert({
    where: { code: 'WELCOME15' },
    update: {},
    create: {
      code: 'WELCOME15',
      title: 'New Client 15% Welcome Discount',
      description: 'Enjoy 15% off your first hair or skin treatment appointment at Veya.',
      discountPercent: 15,
      isActive: true,
    },
  });

  await prisma.promotion.upsert({
    where: { code: 'BRIDALGLOW' },
    update: {},
    create: {
      code: 'BRIDALGLOW',
      title: '₦10,000 Off Luxury Bridal Packages',
      description: 'Special seasonal discount on full bridal pamper packages.',
      discountAmount: 10000,
      isActive: true,
    },
  });

  // 9. Initial Sample Completed Appointment & Review
  const sampleApt = await prisma.appointment.upsert({
    where: { appointmentNumber: 'VEYA-2026-001' },
    update: {},
    create: {
      appointmentNumber: 'VEYA-2026-001',
      customerId: customerUser.id,
      staffId: staffProfile1.id,
      serviceId: servicesMap['box-braids-knotless'],
      date: '2026-09-20',
      startTime: '10:00',
      endTime: '13:00',
      durationMinutes: 180,
      price: 25000,
      status: 'COMPLETED',
      notes: 'Client loves medium size waist length.',
      paymentStatus: 'PAID',
    },
  });

  await prisma.review.upsert({
    where: { appointmentId: sampleApt.id },
    update: {},
    create: {
      appointmentId: sampleApt.id,
      customerId: customerUser.id,
      rating: 5,
      comment: 'Ngozi is hands down the best braider in Lagos! Zero tension on my edges, fast and super neat. I received compliments everywhere I went. Veya Studio is my new home!',
    },
  });

  // 10. Sample upcoming appointment
  await prisma.appointment.upsert({
    where: { appointmentNumber: 'VEYA-2026-002' },
    update: {},
    create: {
      appointmentNumber: 'VEYA-2026-002',
      customerId: customerUser.id,
      staffId: staffProfile3.id,
      serviceId: servicesMap['hydra-glow-facial'],
      date: '2026-10-05',
      startTime: '11:00',
      endTime: '12:15',
      durationMinutes: 75,
      price: 25000,
      status: 'CONFIRMED',
      notes: 'Sensitive skin near cheekbones.',
      paymentStatus: 'PENDING',
    },
  });

  // Notification for customer
  await prisma.notification.create({
    data: {
      userId: customerUser.id,
      title: 'Appointment Confirmed',
      message: 'Your Hydra-Glow Deep Cleansing Facial is confirmed for October 5, 2026 at 11:00 AM with Chidinma.',
      type: 'BOOKING',
      link: '/customer/appointments',
    },
  });

  console.log('Database seeded successfully!');
  console.log('Default credentials:');
  console.log('Admin:    admin@veya.com    / Admin123!');
  console.log('Staff 1:  ngozi@veya.com    / Password123!');
  console.log('Staff 2:  amina@veya.com    / Password123!');
  console.log('Staff 3:  chidinma@veya.com / Password123!');
  console.log('Customer: customer@veya.com / Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
