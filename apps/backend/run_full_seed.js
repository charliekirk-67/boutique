const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('--- Starting Demo Data Seeding ---');

  // 1. Categories
  const catData = [
    { name: 'Bespoke Suits', slug: 'bespoke-suits', order: 1 },
    { name: 'Bridal & Lehengas', slug: 'bridal-lehengas', order: 2 },
    { name: 'Designer Shirts', slug: 'designer-shirts', order: 3 },
    { name: 'Ethnic Sherwanis', slug: 'ethnic-sherwanis', order: 4 },
    { name: 'Silk Sarees', slug: 'silk-sarees', order: 5 },
    { name: 'Tuxedos & Blazers', slug: 'tuxedos-blazers', order: 6 },
  ];

  const categories = [];
  for (const c of catData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: { name: c.name, slug: c.slug, order: c.order },
    });
    categories.push(cat);
  }
  console.log('Verified ' + categories.length + ' Categories.');

  // 2. Tailor / Staff Accounts
  const staffMembers = [
    { fullName: 'Master Ramesh Sharma (Head Tailor)', email: 'ramesh.tailor@marcos.com', phone: '+919876500011', role: 'STAFF' },
    { fullName: 'Suresh Verma (Bespoke Artisan)', email: 'suresh.artisan@marcos.com', phone: '+919876500012', role: 'STAFF' },
    { fullName: 'Ananya Roy (Senior Stylist)', email: 'ananya.stylist@marcos.com', phone: '+919876500013', role: 'STAFF' },
    { fullName: 'Kavita Nair (Store Manager)', email: 'kavita.manager@marcos.com', phone: '+919876500014', role: 'ADMIN' },
  ];

  const staffUsers = [];
  for (const s of staffMembers) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: { fullName: s.fullName, role: s.role },
      create: {
        fullName: s.fullName,
        email: s.email,
        phoneNumber: s.phone,
        role: s.role,
        referralCode: 'STF-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      },
    });
    staffUsers.push(user);
  }
  console.log('Verified ' + staffUsers.length + ' Tailoring Staff members.');

  // 3. Customers
  const customerData = [
    { fullName: 'Aditya Birla', email: 'aditya.birla@sample.com', phone: '+919820011223', address: '14, Marine Drive, Nariman Point, Mumbai - 400021', gender: 'MALE', points: 450 },
    { fullName: 'Priya Sundaram', email: 'priya.sundaram@sample.com', phone: '+919840033445', address: 'Plot 42, Anna Nagar West, Chennai - 600040', gender: 'FEMALE', points: 920 },
    { fullName: 'Vikramaditya Roy', email: 'vikram.roy@sample.com', phone: '+919830055667', address: '88/2 Park Street, Kolkata - 700016', gender: 'MALE', points: 300 },
    { fullName: 'Sneha Kulkarni', email: 'sneha.k@sample.com', phone: '+919850077889', address: 'B-604 Koregaon Park Annex, Pune - 411001', gender: 'FEMALE', points: 1500 },
    { fullName: 'Rohit Mehra', email: 'rohit.mehra@sample.com', phone: '+919810099001', address: 'D-12 Defense Colony, New Delhi - 110024', gender: 'MALE', points: 680 },
    { fullName: 'Meera Nambiar', email: 'meera.nambiar@sample.com', phone: '+919845012345', address: '120 Indiranagar 100ft Road, Bengaluru - 560038', gender: 'FEMALE', points: 2100 },
    { fullName: 'Karan Singhania', email: 'karan.s@sample.com', phone: '+919821098765', address: 'Penthouse 3, Worli Sea Face, Mumbai - 400018', gender: 'MALE', points: 840 },
  ];

  const customers = [];
  for (const c of customerData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: { fullName: c.fullName, address: c.address, pointsBalance: c.points },
      create: {
        fullName: c.fullName,
        email: c.email,
        phoneNumber: c.phone,
        address: c.address,
        gender: c.gender,
        pointsBalance: c.points,
        role: 'CUSTOMER',
        referralCode: 'CUST-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      },
    });
    customers.push(user);
  }
  console.log('Verified ' + customers.length + ' Customers.');

  // 4. Products
  const productsList = [
    {
      name: 'Royal Midnight Tuxedo with Silk Lapel',
      description: 'Hand-tailored from Super 150s Italian wool with rich satin silk peak lapels. Includes bespoke monogram embroidery.',
      price: 28500,
      categorySlug: 'tuxedos-blazers',
      images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
      materialInfo: '100% Super 150s Wool, Mulberry Silk Lapel',
      targetGender: 'MEN',
      inventoryQty: 18,
      salesCount: 42,
      isTrending: true,
    },
    {
      name: 'Emerald Heritage Zardozi Bridal Lehenga',
      description: 'Handcrafted over 240 artisan hours with pure antique gold zardozi and kundan stone embellishments.',
      price: 64900,
      categorySlug: 'bridal-lehengas',
      images: ['https://images.unsplash.com/photo-1583391733959-1c51bf69941a?w=800'],
      materialInfo: 'Raw Silk, Organza Dupatta with Antique Gold Dabka',
      targetGender: 'WOMEN',
      inventoryQty: 8,
      salesCount: 29,
      isTrending: true,
    },
    {
      name: 'Bespoke Double-Breasted Charcoal Pinstripe Suit',
      description: 'Precision cut savile-row style silhouette. Full canvas construction with horn buttons.',
      price: 34000,
      categorySlug: 'bespoke-suits',
      images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'],
      materialInfo: 'English Merino Wool, Bemberg Cupro Lining',
      targetGender: 'MEN',
      inventoryQty: 14,
      salesCount: 38,
      isTrending: true,
    },
    {
      name: 'Pure Kanjeevaram Gold Tissue Silk Saree',
      description: 'Woven with authentic gold zari motifs along the pallu and border. Pure handloom registered silk.',
      price: 22000,
      categorySlug: 'silk-sarees',
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
      materialInfo: '100% Pure Mulberry Silk & Certified Gold Zari',
      targetGender: 'WOMEN',
      inventoryQty: 25,
      salesCount: 65,
      isTrending: true,
    },
    {
      name: 'Ivory Raw Silk Wedding Sherwani',
      description: 'Regal silhouette paired with tonal thread work and pearl buttons. Tailored for wedding celebrations.',
      price: 42000,
      categorySlug: 'ethnic-sherwanis',
      images: ['https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800'],
      materialInfo: 'Raw Silk with Chanderi Stole',
      targetGender: 'MEN',
      inventoryQty: 12,
      salesCount: 31,
      isTrending: false,
    },
    {
      name: 'Egyptian Giza Cotton French Cuff Shirt',
      description: 'Milled from 2-ply 120s Egyptian cotton with removable brass collar stays and mother-of-pearl buttons.',
      price: 4800,
      categorySlug: 'designer-shirts',
      images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
      materialInfo: '100% Long-Staple Giza Cotton',
      targetGender: 'MEN',
      inventoryQty: 40,
      salesCount: 110,
      isTrending: false,
    },
    {
      name: 'Crimson Velvet Bandhgala Evening Jacket',
      description: 'Sophisticated royal Jodhpuri jacket crafted in rich plush velvet with handcrafted crest buttons.',
      price: 19500,
      categorySlug: 'tuxedos-blazers',
      images: ['https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800'],
      materialInfo: 'Plush Micro-Velvet, Satin Lining',
      targetGender: 'MEN',
      inventoryQty: 15,
      salesCount: 22,
      isTrending: false,
    },
    {
      name: 'Pastel Peach Organza Floral Embroidered Saree',
      description: 'Featherlight silk organza adorned with delicate resham thread embroidery and scalloped border.',
      price: 14500,
      categorySlug: 'silk-sarees',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
      materialInfo: 'Silk Organza, Unstitched Blouse Piece Included',
      targetGender: 'WOMEN',
      inventoryQty: 20,
      salesCount: 54,
      isTrending: true,
    }
  ];

  const createdProducts = [];
  for (const p of productsList) {
    const cat = categories.find(c => c.slug === p.categorySlug) || categories[0];
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      const prod = await prisma.product.create({
        data: {
          name: p.name,
          description: p.description,
          price: p.price,
          materialInfo: p.materialInfo,
          images: p.images,
          categoryId: cat.id,
          targetGender: p.targetGender,
          inventoryQty: p.inventoryQty,
          salesCount: p.salesCount,
          isTrending: p.isTrending,
          stockStatus: 'IN_STOCK',
        }
      });
      createdProducts.push(prod);
    } else {
      createdProducts.push(existing);
    }
  }
  console.log('Verified ' + createdProducts.length + ' Products.');

  // 5. Orders
  const orderStatuses = [
    { status: 'DELIVERED', payStatus: 'COMPLETED', payMethod: 'UPI / Online' },
    { status: 'OUT_FOR_DELIVERY', payStatus: 'COMPLETED', payMethod: 'Credit Card' },
    { status: 'SHIPPED', payStatus: 'COMPLETED', payMethod: 'Credit Card' },
    { status: 'PROCESSING', payStatus: 'COMPLETED', payMethod: 'Online Gateway' },
    { status: 'PAID', payStatus: 'COMPLETED', payMethod: 'UPI / NetBanking' },
    { status: 'PENDING', payStatus: 'PENDING', payMethod: 'CASH' },
    { status: 'DELIVERED', payStatus: 'COMPLETED', payMethod: 'CASH' },
    { status: 'PROCESSING', payStatus: 'COMPLETED', payMethod: 'Debit Card' },
  ];

  const now = Date.now();
  for (let i = 0; i < 16; i++) {
    const cust = customers[i % customers.length];
    const prod1 = createdProducts[i % createdProducts.length];
    const prod2 = createdProducts[(i + 2) % createdProducts.length];
    const cfg = orderStatuses[i % orderStatuses.length];
    const daysAgo = Math.floor(Math.random() * 25);
    const orderDate = new Date(now - daysAgo * 86400000);
    const invoiceNum = 'INV-2026-' + (1000 + i + Math.floor(Math.random() * 8000));

    const existingOrder = await prisma.order.findUnique({ where: { invoiceNumber: invoiceNum } });
    if (existingOrder) continue;

    const total = Number(prod1.price) + (i % 2 === 0 ? Number(prod2.price) : 0);
    const tax = Math.round(total * 0.12);
    const payable = total + tax;

    await prisma.order.create({
      data: {
        userId: cust.id,
        invoiceNumber: invoiceNum,
        status: cfg.status,
        paymentStatus: cfg.payStatus,
        paymentMethod: cfg.payMethod,
        totalAmount: total,
        taxAmount: tax,
        payableAmount: payable,
        createdAt: orderDate,
        updatedAt: orderDate,
        deliveryDate: new Date(orderDate.getTime() + 14 * 86400000),
        fabricType: prod1.materialInfo || 'Super 150s Wool',
        customizations: 'Monogram initials on inner pocket; custom horn buttons; slim taper cut.',
        tailorNotes: 'Client preferred slightly longer jacket length. Fitting scheduled.',
        orderItems: {
          create: [
            { productId: prod1.id, quantity: 1, price: prod1.price },
            ...(i % 2 === 0 ? [{ productId: prod2.id, quantity: 1, price: prod2.price }] : []),
          ]
        }
      }
    });
  }
  console.log('Orders populated.');

  // 6. Appointments
  const timeSlots = ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM', '06:00 PM - 07:00 PM'];
  for (let i = 0; i < 8; i++) {
    const cust = customers[i % customers.length];
    const staff = staffUsers[i % staffUsers.length];
    const slot = timeSlots[i % timeSlots.length];
    const apptDate = new Date(now + (i - 2) * 86400000);

    await prisma.appointment.create({
      data: {
        userId: cust.id,
        date: apptDate,
        timeSlot: slot,
        productType: createdProducts[i % createdProducts.length].name,
        type: i % 2 === 0 ? 'MEASUREMENT' : 'CONSULTATION',
        status: i === 0 ? 'CONFIRMED' : 'PENDING',
        notes: 'Customer trial for ' + createdProducts[i % createdProducts.length].name,
        assignedStaffId: staff.id,
        createdAt: new Date(now - 3 * 86400000),
      }
    });
  }

  // 7. Store Visits
  for (let i = 0; i < 6; i++) {
    const cust = customers[(i + 3) % customers.length];
    const staff = staffUsers[i % staffUsers.length];
    const visitDate = new Date(now + (i - 1) * 86400000);

    await prisma.storeVisit.create({
      data: {
        customerId: cust.id,
        preferredDate: visitDate,
        confirmedDate: visitDate,
        address: cust.address || '120 Indiranagar, Bengaluru',
        requirements: 'Home tailoring session for bespoke suit fittings. Customer: ' + cust.fullName,
        status: i % 2 === 0 ? 'ASSIGNED' : 'PENDING',
        assignedStaffId: staff.id,
        createdAt: new Date(now - 2 * 86400000),
      }
    });
  }
  console.log('Appointments & Home Visits populated.');

  // 8. Analytics Events for Funnel
  const eventTypes = ['PRODUCT_VIEW', 'PRODUCT_VIEW', 'ADD_TO_CART', 'CHECKOUT_INITIATED', 'PURCHASE_COMPLETED'];
  for (let day = 0; day < 30; day++) {
    const eventTime = new Date(now - day * 86400000);
    for (let k = 0; k < 12; k++) {
      const prod = createdProducts[k % createdProducts.length];
      const cust = customers[k % customers.length];
      const evType = eventTypes[k % eventTypes.length];

      await prisma.analyticsEvent.create({
        data: {
          eventType: evType,
          productId: prod.id,
          userId: cust.id,
          createdAt: new Date(eventTime.getTime() - Math.random() * 36000000),
        }
      });
    }
  }
  console.log('Analytics Events populated.');

  // 9. Support Tickets
  const ticketTopics = [
    { subject: 'Fitting appointment reschedule request', desc: 'Hi, I need to postpone my Friday fitting by 2 hours if possible.', status: 'IN_PROGRESS' },
    { subject: 'Enquiry about custom Italian wool fabric samples', desc: 'Can your artisan bring fabric swatches for midnight blue tuxedo?', status: 'OPEN' },
    { subject: 'Invoice copy required for company tax claim', desc: 'Please email the GST invoice for INV-2026-1042.', status: 'RESOLVED' },
    { subject: 'Expedited stitching for wedding reception', desc: 'Wedding date moved up by 4 days, need priority stitching.', status: 'IN_PROGRESS' },
  ];

  for (let i = 0; i < ticketTopics.length; i++) {
    const cust = customers[i % customers.length];
    const top = ticketTopics[i];
    await prisma.supportTicket.create({
      data: {
        userId: cust.id,
        subject: top.subject,
        description: top.desc,
        status: top.status,
        createdAt: new Date(now - (i + 1) * 86400000),
        messages: {
          create: [
            { sender: 'CUSTOMER', senderName: cust.fullName, text: top.desc },
            { sender: 'STAFF', senderName: 'MARCOS Concierge', text: 'Thank you for reaching out. Our team has received your request.' }
          ]
        }
      }
    });
  }
  console.log('Support Tickets populated.');
  console.log('--- ALL SEEDING COMPLETE ---');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
