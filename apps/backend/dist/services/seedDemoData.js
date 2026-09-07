"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDemoData = seedDemoData;
const db_js_1 = __importDefault(require("../config/db.js"));
const crypto_js_1 = require("../utils/crypto.js");
const logger_js_1 = __importDefault(require("../utils/logger.js"));
async function seedDemoData() {
    try {
        logger_js_1.default.info('Starting automated demo data check and seeding...');
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
            const cat = await db_js_1.default.category.upsert({
                where: { slug: c.slug },
                update: { name: c.name, order: c.order },
                create: { name: c.name, slug: c.slug, order: c.order },
            });
            categories.push(cat);
        }
        const productsList = [
            {
                name: 'Royal Midnight Tuxedo with Silk Lapel',
                description: 'Hand-tailored from Super 150s Italian wool with rich satin silk peak lapels. Includes bespoke monogram embroidery.',
                price: 28500,
                categorySlug: 'tuxedos-blazers',
                images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
                materialInfo: 'Super 150s Wool, Silk Satin',
                targetGender: 'MEN',
            },
            {
                name: 'Pure Kanjeevaram Gold Tissue Silk Saree',
                description: 'Woven with authentic gold zari motifs along the pallu and border. Pure handloom registered silk.',
                price: 22000,
                categorySlug: 'silk-sarees',
                images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'],
                materialInfo: '100% Pure Mulberry Silk & Certified Gold Zari',
                targetGender: 'WOMEN',
            },
            {
                name: 'Ivory Raw Silk Wedding Sherwani',
                description: 'Regal silhouette paired with tonal thread work and pearl buttons. Tailored for wedding celebrations.',
                price: 42000,
                categorySlug: 'ethnic-sherwanis',
                images: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800'],
                materialInfo: 'Raw Silk with Chanderi Stole',
                targetGender: 'MEN',
            },
            {
                name: 'Egyptian Giza Cotton French Cuff Shirt',
                description: 'Milled from 2-ply 120s Egyptian cotton with removable brass collar stays and mother-of-pearl buttons.',
                price: 4800,
                categorySlug: 'designer-shirts',
                images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
                materialInfo: '100% Long-Staple Giza Cotton',
                targetGender: 'MEN',
            },
            {
                name: 'Crimson Velvet Bandhgala Evening Jacket',
                description: 'Sophisticated royal Jodhpuri jacket crafted in rich plush velvet with handcrafted crest buttons.',
                price: 19500,
                categorySlug: 'tuxedos-blazers',
                images: ['https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800'],
                materialInfo: 'Plush Micro-Velvet, Satin Lining',
                targetGender: 'MEN',
            },
        ];
        const createdProducts = [];
        for (const p of productsList) {
            const cat = categories.find(c => c.slug === p.categorySlug) || categories[0];
            const existing = await db_js_1.default.product.findFirst({ where: { name: p.name } });
            if (!existing) {
                const prod = await db_js_1.default.product.create({
                    data: {
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        materialInfo: p.materialInfo,
                        images: p.images,
                        categoryId: cat.id,
                        targetGender: p.targetGender,
                        inventoryQty: 25,
                        salesCount: 10,
                        isTrending: true,
                        stockStatus: 'IN_STOCK',
                    },
                });
                createdProducts.push(prod);
            }
            else {
                createdProducts.push(existing);
            }
        }
        const defaultPasswordHash = await (0, crypto_js_1.hashPassword)('12345678');
        const customerData = [
            {
                fullName: 'Priya Sundaram',
                email: 'priya.sundaram@sample.com',
                phone: '+919840033445',
                address: 'Plot 42, Anna Nagar West, Chennai - 600040',
                gender: 'FEMALE',
                points: 920,
                stage: 'PROCESSING',
                prodIndex: 1,
                invoiceNum: 'INV-2026-7821',
                fabric: 'Pure Kanjeevaram Silk & Gold Zari',
                customizations: 'Custom embroidered blouse with elbow-length sleeves and deep back neck.',
                notes: 'Priority stitching for wedding reception on Saturday.',
            },
            {
                fullName: 'Aditya Birla',
                email: 'aditya.birla@sample.com',
                phone: '+919820011223',
                address: '14, Marine Drive, Nariman Point, Mumbai - 400021',
                gender: 'MALE',
                points: 450,
                stage: 'PAID',
                prodIndex: 0,
                invoiceNum: 'INV-2026-7822',
                fabric: 'Super 150s Italian Wool & Satin Silk',
                customizations: 'Peak lapel, bespoke silk lining with personal initials.',
                notes: 'Fitting session booked at Mumbai studio.',
            },
            {
                fullName: 'Sneha Kulkarni',
                email: 'sneha.k@sample.com',
                phone: '+919850077889',
                address: 'B-604 Koregaon Park Annex, Pune - 411001',
                gender: 'FEMALE',
                points: 1500,
                stage: 'SHIPPED',
                prodIndex: 1,
                invoiceNum: 'INV-2026-7823',
                fabric: 'Featherlight Organza & Hand Resham Embroidery',
                customizations: 'Scalloped border finish with hand-stitched fall and pico.',
                notes: 'Packed in luxury garment keepsake box.',
            },
            {
                fullName: 'Rohit Mehra',
                email: 'rohit.mehra@sample.com',
                phone: '+919810099001',
                address: 'D-12 Defense Colony, New Delhi - 110024',
                gender: 'MALE',
                points: 680,
                stage: 'OUT_FOR_DELIVERY',
                prodIndex: 2,
                invoiceNum: 'INV-2026-7824',
                fabric: 'Raw Silk with Chanderi Stole',
                customizations: 'Handcrafted pearl buttons, royal mandarin collar.',
                notes: 'Delivery executive dispatched.',
            },
            {
                fullName: 'Meera Nambiar',
                email: 'meera.nambiar@sample.com',
                phone: '+919845012345',
                address: '120 Indiranagar 100ft Road, Bengaluru - 560038',
                gender: 'FEMALE',
                points: 2100,
                stage: 'DELIVERED',
                prodIndex: 1,
                invoiceNum: 'INV-2026-7825',
                fabric: 'Pure Mulberry Tissue Silk',
                customizations: 'Contrast pallu with traditional peacock motifs.',
                notes: 'Delivered successfully and customer signed receipt.',
            },
            {
                fullName: 'Vikramaditya Roy',
                email: 'vikram.roy@sample.com',
                phone: '+919830055667',
                address: '88/2 Park Street, Kolkata - 700016',
                gender: 'MALE',
                points: 300,
                stage: 'PENDING',
                prodIndex: 3,
                invoiceNum: 'INV-2026-7826',
                fabric: '2-ply 120s Egyptian Giza Cotton',
                customizations: 'French cuffs with monogrammed cuff links.',
                notes: 'Awaiting customer confirmation for fitting date.',
            },
            {
                fullName: 'Karan Singhania',
                email: 'karan.s@sample.com',
                phone: '+919821098765',
                address: 'Penthouse 3, Worli Sea Face, Mumbai - 400018',
                gender: 'MALE',
                points: 840,
                stage: 'PROCESSING',
                prodIndex: 4,
                invoiceNum: 'INV-2026-7827',
                fabric: 'Plush Velvet with Satin Lining',
                customizations: 'Handcrafted heraldic crest buttons.',
                notes: 'In stitching line under Head Tailor Master Ramesh.',
            },
            {
                fullName: 'Sanjai Pandian',
                email: 'sanjaipandian.as@gmail.com',
                phone: '+919000000002',
                address: 'Marcos Flagship Suite, Chennai - 600001',
                gender: 'MALE',
                points: 500,
                stage: 'PAID',
                prodIndex: 0,
                invoiceNum: 'INV-2026-7828',
                fabric: 'Super 150s Italian Wool & Satin Silk',
                customizations: 'Slim fit cut, peak lapels, personalized lining monogram.',
                notes: 'Measurement session verified.',
            },
        ];
        const now = Date.now();
        for (const c of customerData) {
            const customer = await db_js_1.default.user.upsert({
                where: { email: c.email },
                update: {
                    fullName: c.fullName,
                    address: c.address,
                    pointsBalance: c.points,
                    passwordHash: defaultPasswordHash,
                },
                create: {
                    fullName: c.fullName,
                    email: c.email,
                    phoneNumber: c.phone,
                    address: c.address,
                    gender: c.gender,
                    pointsBalance: c.points,
                    role: 'CUSTOMER',
                    passwordHash: defaultPasswordHash,
                    referralCode: 'CUST-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
                },
            });
            const existingOrder = await db_js_1.default.order.findFirst({
                where: { userId: customer.id },
            });
            if (!existingOrder) {
                const prod = createdProducts[c.prodIndex % createdProducts.length];
                const total = Number(prod.price);
                const tax = Math.round(total * 0.12);
                const payable = total + tax;
                const orderDate = new Date(now - 3 * 86400000);
                const order = await db_js_1.default.order.create({
                    data: {
                        userId: customer.id,
                        invoiceNumber: c.invoiceNum,
                        status: c.stage,
                        paymentStatus: c.stage === 'PENDING' ? 'PENDING' : 'COMPLETED',
                        paymentMethod: 'UPI / NetBanking',
                        totalAmount: total,
                        taxAmount: tax,
                        payableAmount: payable,
                        createdAt: orderDate,
                        updatedAt: orderDate,
                        deliveryDate: new Date(orderDate.getTime() + 10 * 86400000),
                        fabricType: c.fabric,
                        customizations: c.customizations,
                        tailorNotes: c.notes,
                        orderItems: {
                            create: [
                                {
                                    productId: prod.id,
                                    quantity: 1,
                                    price: prod.price,
                                },
                            ],
                        },
                    },
                });
                await db_js_1.default.appointment.create({
                    data: {
                        userId: customer.id,
                        date: new Date(now + 2 * 86400000),
                        timeSlot: '02:00 PM - 03:00 PM',
                        productType: prod.name,
                        type: 'MEASUREMENT',
                        status: 'CONFIRMED',
                        notes: c.invoiceNum,
                        createdAt: orderDate,
                    },
                });
                logger_js_1.default.info(`Created order ${order.invoiceNumber} (${c.stage}) for ${customer.fullName}`);
            }
        }
        logger_js_1.default.info('Demo data seeding completed successfully! All demo accounts have password "12345678".');
        return { success: true, message: 'All demo accounts and orders seeded successfully.' };
    }
    catch (err) {
        logger_js_1.default.error('Error during demo data seeding:', { metadata: { error: err.message, stack: err.stack } });
        return { success: false, error: err.message };
    }
}
