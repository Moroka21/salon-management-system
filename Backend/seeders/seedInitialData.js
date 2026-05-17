const { User, Service } = require('../models');

const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
const sourceImage = (terms) =>
  `https://source.unsplash.com/900x1200/?${encodeURIComponent(terms)}`;

const serviceImages = {
  'Box Braids': 'https://i2.wp.com/www.hadviser.com/wp-content/uploads/2023/04/4-long-jumbo-box-braids-with-curls-Coip5Mssz51.jpg?resize=1080%2C1350&ssl=1',
  'Knotless Braids': 'https://i.pinimg.com/originals/df/c9/6b/dfc96b944181eb569256261d9815bf9a.jpg',
  Cornrows: 'https://i.pinimg.com/originals/ff/5b/f4/ff5bf4335f5c2bc99260baf4ad186430.jpg',
  'Straight Back': 'https://i.pinimg.com/736x/71/a9/d9/71a9d986666f99acb861ab178dc893d1.jpg',
  'straight up': sourceImage('straight up braids hairstyle'),
  'Butterfly Locs': 'https://i.pinimg.com/736x/3a/7e/70/3a7e705a4393db8a1c4cdc8b040d67f8.jpg',
  'Silk Press': sourceImage('silk press hairstyle straight hair salon'),
  'Wig Installation': 'https://www.goddessfacesbeauty.com/uploads/1/0/2/4/102434022/s491512091230555064_p185_i2_w1038.jpeg',
  'Natural Twist Out': 'https://i.pinimg.com/originals/73/1a/ca/731aca79fcf199bc54d18f9621618348.jpg',
  'Wash and Blow Dry': image('photo-1562322140-8baeececf3df'),
  'Relaxer Treatment': sourceImage('relaxed hair straight hairstyle salon'),
  'Hair Colour': image('photo-1519699047748-de8e457a634e'),
  Balayage: image('photo-1498843053639-170ff2122f35'),
  'Twist with curly ends': 'https://image.made-in-china.com/202f0j00fUnGsVuPYopj/Goddess-Wavy-Senegalese-Twist-Crochet-Braiding-Hair-Extensions-with-Curly-Ends-Ombre.jpg',
  'Barrel braids': 'https://i.pinimg.com/originals/de/b5/de/deb5de2c1841d09322a4aeba79f2ba64.jpg',
  'Pixie Cut': 'https://i.pinimg.com/736x/f8/3a/f4/f83af44f59ba7d4c9e901d48ad52ea54.jpg',
  'Bob Cut': sourceImage('bob haircut hairstyle salon'),
  'Sew-In Weave': 'https://content.latest-hairstyles.com/wp-content/uploads/wet-and-wavy-weave-style.jpg',
  'Ponytail Styling': 'https://i.pinimg.com/originals/93/f5/ed/93f5edf0a2cc2722ab2c5d7d5f3c46a9.jpg',
  'Dreadlock Retwist': 'https://i.pinimg.com/originals/9d/fe/ea/9dfeea97b53c24eed3e8b642730cade7.jpg',
  'Kids Braids': 'https://i.pinimg.com/originals/ab/83/eb/ab83ebe58c2900a0e0d6f438c5a776c2.jpg',
  'Updo Styling': 'https://www.fabmood.com/inspiration/wp-content/uploads/2023/03/2023-updo-hairstyles-9.jpg',
  'Curls and Waves': 'https://i.pinimg.com/originals/06/2b/a7/062ba7facd6ed1a22dd341c27a291d50.png',
  'Scalp Treatment': image('photo-1515377905703-c4788e51af15'),
  'Bridal Hair': 'https://i1.wp.com/www.hadviser.com/wp-content/uploads/2023/04/9-vintage-and-stylish-black-wedding-updo-Cjhxh0NoB71.jpg?resize=1233%2C1323&ssl=1',
  'Classic Manicure': image('photo-1604654894610-df63bc536371'),
  'Gel Manicure': image('photo-1610992015732-2449b76344bc'),
  'Acrylic Full Set': image('photo-1519014816548-bf5fe059798b'),
  'French Tips': sourceImage('french tip nails manicure'),
  'Nail Art': 'https://ladylife.style/wp-content/uploads/2017/12/38-1.jpg',
  Pedicure: image('photo-1519415510236-718bdfcd89c8'),
  'Gel Pedicure': 'https://www.sistersbeautylounge.com/wp-content/uploads/2024/07/BIAB-Pedicure.jpg',
  'Acrylic Fill': image('photo-1604654894611-6973b376cbde'),
  'Ombre Nails': 'https://i5.walmartimages.com/asr/ed7944e0-3830-4446-9384-443ed05b8a56.8ae6a92a4e9447346a9ef03334292606.jpeg',
  'Nail Repair': sourceImage('nail repair manicure salon'),
};

const hairstyleServices = [
  ['Box Braids', 650, 240, serviceImages['Box Braids']],
  ['Knotless Braids', 720, 260, serviceImages['Knotless Braids']],
  ['Cornrows', 280, 90, serviceImages.Cornrows],
  ['Straight Back', 300, 75, serviceImages['Straight Back']],
  ['Butterfly Locs', 450, 120, serviceImages['Butterfly Locs']],
  ['Silk Press', 450, 120, serviceImages['Silk Press']],
  ['Wig Installation', 550, 150, serviceImages['Wig Installation']],
  ['Natural Twist Out', 320, 90, serviceImages['Natural Twist Out']],
  ['Wash and Blow Dry', 220, 60, serviceImages['Wash and Blow Dry']],
  ['Relaxer Treatment', 380, 100, serviceImages['Relaxer Treatment']],
  ['Twist with curly ends', 700, 150, serviceImages['Twist with curly ends']],
  ['Barrel braids', 980, 180, serviceImages['Barrel braids']],
  ['Pixie Cut', 260, 60, serviceImages['Pixie Cut']],
  ['Bob Cut', 300, 75, serviceImages['Bob Cut']],
  ['Sew-In Weave', 620, 180, serviceImages['Sew-In Weave']],
  ['Ponytail Styling', 350, 75, serviceImages['Ponytail Styling']],
  ['Dreadlock Retwist', 420, 120, serviceImages['Dreadlock Retwist']],
  ['Kids Braids', 300, 120, serviceImages['Kids Braids']],
  ['Updo Styling', 480, 90, serviceImages['Updo Styling']],
  ['Curls and Waves', 360, 75, serviceImages['Curls and Waves']],
  ['Scalp Treatment', 250, 45, serviceImages['Scalp Treatment']],
  ['Bridal Hair', 1200, 210, serviceImages['Bridal Hair']],
];

const nailServices = [
  ['Classic Manicure', 160, 45, serviceImages['Classic Manicure']],
  ['Gel Manicure', 230, 60, serviceImages['Gel Manicure']],
  ['Acrylic Full Set', 420, 90, serviceImages['Acrylic Full Set']],
  ['French Tips', 260, 65, serviceImages['French Tips']],
  ['Nail Art', 300, 75, serviceImages['Nail Art']],
  ['Pedicure', 240, 60, serviceImages.Pedicure],
  ['Gel Pedicure', 310, 70, serviceImages['Gel Pedicure']],
  ['Acrylic Fill', 280, 60, serviceImages['Acrylic Fill']],
  ['Ombre Nails', 380, 85, serviceImages['Ombre Nails']],
  ['Nail Repair', 90, 30, serviceImages['Nail Repair']],
];

const seedUserOnce = async (payload) => {
  const existing = await User.findOne({ where: { email: payload.email } });
  if (existing) {
    await existing.update({
      firstName: payload.firstName,
      lastName: payload.lastName,
      phone: payload.phone,
      role: payload.role,
      isActive: true,
    });
    return existing;
  }
  return User.create(payload);
};

const seedServiceOnce = async ({ name, category, price, durationMinutes, imageUrl }) => {
  const payload = {
    name,
    category,
    price,
    durationMinutes,
    imageUrl,
    description: `${name} ${category === 'Nails' ? 'nail styling' : 'hairstyle'} service.`,
    isActive: true,
  };
  const existing = await Service.findOne({ where: { name } });
  if (existing) {
    await existing.update(payload);
    return existing;
  }
  return Service.create(payload);
};

const seedInitialData = async () => {
  await seedUserOnce({
    firstName: 'Rachidi',
    lastName: 'Jane',
    phone: '0639390931',
    email: 'mamcyrachidi@icloud.com',
    password: 'Mokgaga@11.',
    role: 'Admin',
  });

  await seedUserOnce({
    firstName: 'Rachidi',
    lastName: 'Jessica',
    phone: '0608185119',
    email: 'jessica.rachidi@jjbeautybar.local',
    password: 'Jessica@11',
    role: 'Staff',
  });

  await Promise.all([
    ...hairstyleServices.map(([name, price, durationMinutes, imageUrl]) =>
      seedServiceOnce({ name, category: 'Hairstyle', price, durationMinutes, imageUrl })
    ),
    ...nailServices.map(([name, price, durationMinutes, imageUrl]) =>
      seedServiceOnce({ name, category: 'Nails', price, durationMinutes, imageUrl })
    ),
  ]);

  await Promise.all(
    Object.entries(serviceImages).map(([name, imageUrl]) =>
      Service.update({ imageUrl }, { where: { name } })
    )
  );

  await Service.update({ isActive: false }, { where: { name: ['Haircut', 'Nails'] } });
};

module.exports = seedInitialData;
