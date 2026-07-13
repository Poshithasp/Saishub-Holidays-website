// Seed script for Saishubh Holidays
// - Creates default admin (admin / admin123)
// - Seeds all 12 official tour packages (rich itineraries)
// - Seeds sample testimonials & gallery entries

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const PACKAGES = [
  // ---------------- DOMESTIC ----------------
  {
    name: 'Mysore Sightseeing - 1 Day',
    category: 'Domestic',
    duration: '1 Day',
    startingLocation: 'Bengaluru',
    bestTimeToVisit: 'October to March',
    highlights: [
      'Mysore Palace guided tour',
      'Chamundi Hills viewpoint',
      'Brindavan Gardens musical fountain',
      'St. Philomena\u2019s Cathedral',
    ],
    itinerary: [
      { day: 1, title: 'Bengaluru \u2192 Mysore \u2192 Bengaluru', activities: ['Early morning departure from Bengaluru', 'Visit Mysore Palace', 'Lunch at local restaurant', 'Chamundi Hills darshan & Nandi statue', 'Brindavan Gardens light show', 'Return to Bengaluru by night'] }
    ],
    inclusions: ['AC transport from Bengaluru', 'Driver allowance & fuel', 'All toll & parking', 'Bottled water'],
    exclusions: ['Meals', 'Monument entry fees', 'Personal expenses'],
    gallery: [
      '/images/packages/mysore.jpg',
    ],
    mapUrl: 'https://www.google.com/maps/place/Mysuru,+Karnataka',
  },
  {
    name: 'Mysore - Ooty - Coonoor - 3 Days',
    category: 'Domestic',
    duration: '3 Days / 2 Nights',
    startingLocation: 'Bengaluru',
    bestTimeToVisit: 'October to May',
    highlights: [
      'Mysore Palace & Brindavan Gardens',
      'Ooty Botanical Garden & Boat House',
      'Coonoor tea gardens & Sim\u2019s Park',
      'Nilgiri toy train ride (subject to availability)',
    ],
    itinerary: [
      { day: 1, title: 'Bengaluru \u2192 Mysore \u2192 Ooty', activities: ['Depart Bengaluru early morning', 'Mysore Palace, Chamundi Hills', 'Drive to Ooty via Bandipur/Mudumalai', 'Check-in & overnight in Ooty'] },
      { day: 2, title: 'Ooty Sightseeing', activities: ['Botanical Gardens', 'Ooty Lake boating', 'Doddabetta peak', 'Tea Factory & Museum', 'Overnight in Ooty'] },
      { day: 3, title: 'Coonoor \u2192 Bengaluru', activities: ['Sim\u2019s Park & Dolphin\u2019s Nose', 'Lamb\u2019s Rock viewpoint', 'Return drive to Bengaluru'] },
    ],
    inclusions: ['AC transport', '2 nights hotel stay', 'Daily breakfast', 'Driver allowance & fuel', 'All toll & parking'],
    exclusions: ['Lunch & dinner', 'Monument & garden entry fees', 'Toy train tickets', 'Personal expenses'],
    gallery: ['/images/packages/ooty.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Ooty,+Tamil+Nadu',
  },
  {
    name: 'Ooty - Coonoor - 2 Days',
    category: 'Domestic',
    duration: '2 Days / 1 Night',
    startingLocation: 'Bengaluru',
    bestTimeToVisit: 'October to May',
    highlights: ['Ooty Lake & Botanical Garden', 'Doddabetta Peak', 'Coonoor tea plantations', 'Sim\u2019s Park'],
    itinerary: [
      { day: 1, title: 'Bengaluru \u2192 Ooty', activities: ['Early departure from Bengaluru', 'Drive via Bandipur', 'Ooty Lake boating', 'Botanical Gardens', 'Overnight in Ooty'] },
      { day: 2, title: 'Coonoor \u2192 Bengaluru', activities: ['Doddabetta peak sunrise', 'Tea Museum', 'Coonoor Sim\u2019s Park', 'Return to Bengaluru'] },
    ],
    inclusions: ['AC transport', '1 night hotel stay', 'Breakfast', 'Fuel, toll & parking'],
    exclusions: ['Lunch & dinner', 'Entry fees', 'Personal expenses'],
    gallery: ['/images/packages/ooty.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Coonoor,+Tamil+Nadu',
  },
  {
    name: 'Munnar - Alleppey - Cochin - 4 Days',
    category: 'Domestic',
    duration: '4 Days / 3 Nights',
    startingLocation: 'Cochin',
    bestTimeToVisit: 'September to March',
    highlights: ['Munnar tea gardens', 'Eravikulam National Park', 'Alleppey houseboat cruise', 'Cochin Fort & Chinese fishing nets'],
    itinerary: [
      { day: 1, title: 'Cochin \u2192 Munnar', activities: ['Airport pickup', 'Drive to Munnar via Cheeyappara falls', 'Check-in & leisure evening'] },
      { day: 2, title: 'Munnar Sightseeing', activities: ['Eravikulam National Park', 'Tea Museum', 'Mattupetty Dam', 'Echo Point'] },
      { day: 3, title: 'Munnar \u2192 Alleppey Houseboat', activities: ['Drive to Alleppey', 'Board deluxe houseboat', 'Cruise through backwaters', 'Overnight on houseboat'] },
      { day: 4, title: 'Alleppey \u2192 Cochin', activities: ['Disembark houseboat', 'Fort Kochi walking tour', 'Chinese fishing nets', 'Airport drop'] },
    ],
    inclusions: ['AC transport', '2N hotel + 1N houseboat', 'Breakfast & houseboat full-board meals', 'Airport transfers'],
    exclusions: ['Airfare', 'Lunch & dinner (except houseboat day)', 'Entry fees', 'Personal expenses'],
    gallery: ['/images/packages/kerala.webp'],
    mapUrl: 'https://www.google.com/maps/place/Alappuzha,+Kerala',
  },
  {
    name: 'Hyderabad - Ramoji Film City - 3 Days',
    category: 'Domestic',
    duration: '3 Days / 2 Nights',
    startingLocation: 'Hyderabad',
    bestTimeToVisit: 'October to March',
    highlights: ['Charminar & Chowmahalla Palace', 'Golconda Fort sound & light show', 'Ramoji Film City full-day tour', 'Hussain Sagar lake ride'],
    itinerary: [
      { day: 1, title: 'Hyderabad Arrival & City Tour', activities: ['Airport pickup', 'Charminar & Laad Bazaar', 'Chowmahalla Palace', 'Hussain Sagar & Buddha statue', 'Overnight in Hyderabad'] },
      { day: 2, title: 'Ramoji Film City', activities: ['Full-day at Ramoji Film City', 'Studio tours, live shows, adventure zone', 'Return to hotel'] },
      { day: 3, title: 'Golconda & Departure', activities: ['Golconda Fort morning visit', 'Qutb Shahi Tombs', 'Airport drop'] },
    ],
    inclusions: ['AC transport', '2 nights 3-star hotel', 'Breakfast', 'Ramoji entry tickets', 'Airport transfers'],
    exclusions: ['Airfare', 'Lunch & dinner', 'Monument entry fees', 'Personal expenses'],
    gallery: ['/images/packages/hyderabad.webp'],
    mapUrl: 'https://www.google.com/maps/place/Ramoji+Film+City',
  },
  {
    name: 'Delhi - Agra - Jaipur - 5 Days',
    category: 'Domestic',
    duration: '5 Days / 4 Nights',
    startingLocation: 'Delhi',
    bestTimeToVisit: 'October to March',
    highlights: ['Taj Mahal at sunrise', 'Agra Fort', 'Amber Fort with elephant ride', 'Hawa Mahal & City Palace Jaipur', 'India Gate & Qutub Minar'],
    itinerary: [
      { day: 1, title: 'Delhi Arrival & City Tour', activities: ['Airport pickup', 'India Gate, Rashtrapati Bhavan', 'Qutub Minar', 'Humayun\u2019s Tomb'] },
      { day: 2, title: 'Delhi \u2192 Agra', activities: ['Drive to Agra via Yamuna Expressway', 'Agra Fort', 'Mehtab Bagh sunset view', 'Overnight in Agra'] },
      { day: 3, title: 'Taj Mahal \u2192 Jaipur', activities: ['Sunrise Taj Mahal visit', 'Drive to Jaipur via Fatehpur Sikri', 'Check-in Jaipur'] },
      { day: 4, title: 'Jaipur Sightseeing', activities: ['Amber Fort with elephant ride', 'Jal Mahal photo stop', 'City Palace & Jantar Mantar', 'Hawa Mahal', 'Local bazaars'] },
      { day: 5, title: 'Jaipur \u2192 Delhi Departure', activities: ['Drive to Delhi', 'Airport drop'] },
    ],
    inclusions: ['AC transport', '4 nights hotel stay', 'Daily breakfast', 'Airport & inter-city transfers'],
    exclusions: ['Airfare', 'Lunch & dinner', 'Monument entry fees', 'Elephant ride fees', 'Personal expenses'],
    gallery: ['/images/packages/delhi.jpg', '/images/packages/agra.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Taj+Mahal',
  },

  // ---------------- PILGRIMAGE ----------------
  {
    name: 'Tirupati Sarva Darshan - 1 Day',
    category: 'Pilgrimage',
    duration: '1 Day',
    startingLocation: 'Bengaluru / Chennai',
    bestTimeToVisit: 'All year (avoid Brahmotsavam rush)',
    highlights: ['Tirumala Sri Venkateswara Swamy darshan', 'Padmavathi Temple, Tiruchanoor', 'Kapila Theertham'],
    itinerary: [
      { day: 1, title: 'Tirupati Sarva Darshan', activities: ['Early morning departure', 'Sarva Darshan at Tirumala', 'Prasadam / Laddu', 'Padmavathi Temple', 'Return in evening'] },
    ],
    inclusions: ['AC transport', 'Toll, parking, driver allowance', 'Darshan queue guidance'],
    exclusions: ['Special entry darshan tickets (if opted)', 'Meals', 'Personal expenses'],
    gallery: ['/images/packages/tirupati.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Tirumala',
  },
  {
    name: 'Tirupati - Srikalahasti Package',
    category: 'Pilgrimage',
    duration: '2 Days / 1 Night',
    startingLocation: 'Bengaluru / Chennai',
    bestTimeToVisit: 'All year',
    highlights: ['Tirumala darshan', 'Srikalahasti Rahu-Ketu pooja', 'Padmavathi Temple'],
    itinerary: [
      { day: 1, title: 'Tirupati Darshan', activities: ['Arrive Tirupati', 'Tirumala Sarva Darshan', 'Overnight in Tirupati'] },
      { day: 2, title: 'Srikalahasti \u2192 Return', activities: ['Srikalahasti temple pooja', 'Padmavathi Temple, Tiruchanoor', 'Return journey'] },
    ],
    inclusions: ['AC transport', '1 night hotel', 'Breakfast', 'Darshan assistance'],
    exclusions: ['Special darshan tickets', 'Pooja materials', 'Personal expenses'],
    gallery: ['/images/packages/tirupati.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Srikalahasti',
  },
  {
    name: 'Tirupati - Madurai - Rameshwaram - 3 Days',
    category: 'Pilgrimage',
    duration: '3 Days / 2 Nights',
    startingLocation: 'Chennai',
    bestTimeToVisit: 'October to March',
    highlights: ['Tirumala Balaji darshan', 'Madurai Meenakshi Amman Temple', 'Rameshwaram Ramanathaswamy Temple', 'Dhanushkodi ghost town'],
    itinerary: [
      { day: 1, title: 'Chennai \u2192 Tirupati \u2192 Madurai', activities: ['Tirumala darshan', 'Overnight travel to Madurai'] },
      { day: 2, title: 'Madurai \u2192 Rameshwaram', activities: ['Meenakshi Amman Temple morning aarti', 'Drive to Rameshwaram via Pamban bridge', 'Ramanathaswamy Temple 22 wells snan', 'Overnight in Rameshwaram'] },
      { day: 3, title: 'Dhanushkodi \u2192 Chennai', activities: ['Dhanushkodi visit', 'Return to Chennai'] },
    ],
    inclusions: ['AC transport', '2 nights hotel', 'Breakfast', 'Temple darshan assistance'],
    exclusions: ['Special darshan tickets', 'Lunch & dinner', 'Personal expenses'],
    gallery: ['/images/packages/rameshwaram.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Rameswaram,+Tamil+Nadu',
  },
  {
    name: 'Madurai - Rameshwaram - Kanyakumari - 3 Days',
    category: 'Pilgrimage',
    duration: '3 Days / 2 Nights',
    startingLocation: 'Madurai',
    bestTimeToVisit: 'October to March',
    highlights: ['Meenakshi Amman Temple', 'Rameshwaram temple & Pamban bridge', 'Kanyakumari Vivekananda Rock Memorial', 'Sunrise & sunset at Kanyakumari'],
    itinerary: [
      { day: 1, title: 'Madurai Temple Tour', activities: ['Arrive Madurai', 'Meenakshi Amman Temple', 'Thirumalai Nayakkar Palace', 'Overnight stay'] },
      { day: 2, title: 'Madurai \u2192 Rameshwaram \u2192 Kanyakumari', activities: ['Drive to Rameshwaram', 'Ramanathaswamy Temple 22 wells', 'Dhanushkodi', 'Drive to Kanyakumari', 'Overnight'] },
      { day: 3, title: 'Kanyakumari Sightseeing', activities: ['Sunrise at Triveni Sangam', 'Vivekananda Rock Memorial ferry', 'Thiruvalluvar Statue', 'Return'] },
    ],
    inclusions: ['AC transport', '2 nights hotel', 'Breakfast'],
    exclusions: ['Special darshan / ferry tickets', 'Lunch & dinner', 'Personal expenses'],
    gallery: ['/images/packages/kanyakumari.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Kanyakumari,+Tamil+Nadu',
  },
  {
    name: 'Shirdi - Shani Shingnapur - Nashik - 3 Days',
    category: 'Pilgrimage',
    duration: '3 Days / 2 Nights',
    startingLocation: 'Mumbai / Pune',
    bestTimeToVisit: 'All year',
    highlights: ['Shirdi Sai Baba Samadhi Mandir', 'Shani Shingnapur temple', 'Nashik Trimbakeshwar Jyotirlinga', 'Panchavati Ram Kund'],
    itinerary: [
      { day: 1, title: 'Shirdi Darshan', activities: ['Arrive Shirdi', 'Sai Baba Samadhi darshan', 'Dwarkamai & Chavadi', 'Overnight in Shirdi'] },
      { day: 2, title: 'Shani Shingnapur \u2192 Nashik', activities: ['Shani Shingnapur temple visit', 'Drive to Nashik', 'Trimbakeshwar darshan', 'Overnight in Nashik'] },
      { day: 3, title: 'Panchavati \u2192 Return', activities: ['Panchavati Kalaram Mandir', 'Ram Kund', 'Return journey'] },
    ],
    inclusions: ['AC transport', '2 nights hotel', 'Breakfast', 'Darshan queue assistance'],
    exclusions: ['VIP darshan tickets', 'Meals', 'Personal expenses'],
    gallery: ['/images/packages/shirdi.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Shirdi,+Maharashtra',
  },
  {
    name: 'Varanasi - Gaya - Prayagraj - Ayodhya - 6 Days',
    category: 'Pilgrimage',
    duration: '6 Days / 5 Nights',
    startingLocation: 'Varanasi',
    bestTimeToVisit: 'October to March',
    highlights: ['Kashi Vishwanath temple', 'Ganga Aarti at Dashashwamedh Ghat', 'Vishnupad temple Gaya & Pind Daan', 'Triveni Sangam Prayagraj', 'Shri Ram Mandir Ayodhya'],
    itinerary: [
      { day: 1, title: 'Varanasi Arrival', activities: ['Airport pickup', 'Kashi Vishwanath darshan', 'Evening Ganga Aarti'] },
      { day: 2, title: 'Varanasi \u2192 Gaya', activities: ['Sarnath morning visit', 'Drive to Gaya', 'Vishnupad temple'] },
      { day: 3, title: 'Gaya \u2192 Prayagraj', activities: ['Pind Daan (optional)', 'Drive to Prayagraj', 'Local temples'] },
      { day: 4, title: 'Prayagraj Sightseeing', activities: ['Triveni Sangam boat ride', 'Anand Bhavan', 'Bade Hanuman Ji'] },
      { day: 5, title: 'Prayagraj \u2192 Ayodhya', activities: ['Drive to Ayodhya', 'Shri Ram Janmabhoomi darshan', 'Hanuman Garhi', 'Overnight in Ayodhya'] },
      { day: 6, title: 'Ayodhya Return', activities: ['Sarayu ghat aarti', 'Drop to Lucknow / Varanasi airport'] },
    ],
    inclusions: ['AC transport', '5 nights hotel', 'Daily breakfast', 'All temple assistance'],
    exclusions: ['Airfare', 'Pind Daan pooja materials', 'Lunch & dinner', 'Personal expenses'],
    gallery: ['/images/packages/varanasi.jpg'],
    mapUrl: 'https://www.google.com/maps/place/Varanasi,+Uttar+Pradesh',
  },
]

const TESTIMONIALS = [
  { name: 'Anjali & Rohit', rating: 5, message: 'Absolutely magical. Every detail was handled beautifully \u2014 the best decision we made was choosing Saishubh Holidays for our honeymoon.', location: 'Bengaluru' },
  { name: 'Mr. & Mrs. Rao', rating: 5, message: 'A once-in-a-lifetime spiritual journey. The team took care of us like family every step of the way.', location: 'Mysuru' },
  { name: 'The Menon Family', rating: 5, message: 'From kids to grandparents, everyone had a story to tell. Truly seamless, luxurious and heart-touching.', location: 'Kochi' },
  { name: 'Priya Sharma', rating: 5, message: 'Kashmir looked like a dream. Hotels, transfers, food \u2014 everything was perfect. Highly recommended.', location: 'Delhi' },
  { name: 'Ramesh Iyer', rating: 5, message: 'Fast Tirupati darshan, comfortable stay, and warm hospitality. Very well organised.', location: 'Chennai' },
]

const GALLERY = [
  { imageUrl: 'https://images.unsplash.com/photo-1682686581264-c47e25e61d95?crop=entropy&cs=srgb&fm=jpg&q=85', category: 'Domestic' },
  { imageUrl: 'https://images.unsplash.com/photo-1523496922380-91d5afba98a3?crop=entropy&cs=srgb&fm=jpg&q=85', category: 'Domestic' },
  { imageUrl: 'https://images.unsplash.com/photo-1573352763925-82bd5dfc31d1?crop=entropy&cs=srgb&fm=jpg&q=85', category: 'Pilgrimage' },
  { imageUrl: 'https://images.unsplash.com/photo-1603766806347-54cdf3745953?crop=entropy&cs=srgb&fm=jpg&q=85', category: 'Pilgrimage' },
  { imageUrl: 'https://images.unsplash.com/photo-1524443169398-9aa1ceab67d5?crop=entropy&cs=srgb&fm=jpg&q=85', category: 'Pilgrimage' },
]

async function main() {
  console.log('\ud83c\udf31 Seeding Saishubh Holidays database\u2026')

  // 1. Admin — created once from env; never reset on re-run (idempotent & safe).
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD
  const existingAdmin = await prisma.admin.findUnique({ where: { username: adminUsername } })
  if (!existingAdmin) {
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD env var is required to create the initial admin account.')
    }
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    await prisma.admin.create({ data: { username: adminUsername, passwordHash, role: 'admin' } })
    console.log(`  \u2713 Admin created (username: ${adminUsername}); password taken from ADMIN_PASSWORD`)
  } else {
    console.log(`  \u2713 Admin already exists (username: ${adminUsername}); password left unchanged`)
  }

  // 2. Packages
  for (const p of PACKAGES) {
    await prisma.tourPackage.upsert({
      where: { name: p.name },
      update: { ...p, isActive: true },
      create: { ...p, isActive: true },
    })
  }
  console.log(`  \u2713 ${PACKAGES.length} tour packages seeded`)

  // 3. Testimonials
  await prisma.testimonial.deleteMany({})
  await prisma.testimonial.createMany({ data: TESTIMONIALS })
  console.log(`  \u2713 ${TESTIMONIALS.length} testimonials seeded`)

  // 4. Gallery
  await prisma.gallery.deleteMany({})
  await prisma.gallery.createMany({ data: GALLERY })
  console.log(`  \u2713 ${GALLERY.length} gallery entries seeded`)

  console.log('\ud83c\udf89 Seed complete')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
