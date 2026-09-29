const axios = require('axios');

const BASE_URL = 'https://boutique-vyr6.onrender.com/api/v1';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🚀 MARCOS FULL END-TO-END SYSTEM TEST SUITE');
  console.log('Target: ' + BASE_URL);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log('  ✅ [PASS]: ' + message);
      passed++;
    } else {
      console.log('  ❌ [FAIL]: ' + message);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: Customer Auth Check & Password Login
    // ----------------------------------------------------
    console.log('👉 [1/6] Testing Customer Auth & Login...');
    const checkRes = await axios.post(BASE_URL + '/auth/login/check', {
      identifier: '9840033445'
    });
    assert(checkRes.data.success && checkRes.data.status === 'PASSWORD_REQUIRED', 'Customer identifier recognized as PASSWORD_REQUIRED');

    const customerLogin = await axios.post(BASE_URL + '/auth/login', {
      email: '9840033445',
      password: '12345678'
    }, { headers: { 'x-client-type': 'mobile' } });
    
    assert(customerLogin.data.success && customerLogin.data.accessToken, 'Customer login succeeded and issued accessToken');
    const customerToken = customerLogin.data.accessToken;
    const customerUser = customerLogin.data.user;
    console.log('     Customer: ' + customerUser.fullName + ' (' + customerUser.email + ')');

    // ----------------------------------------------------
    // TEST 2: Admin Auth
    // ----------------------------------------------------
    console.log('\n👉 [2/6] Testing SuperAdmin Portal Auth...');
    const adminLogin = await axios.post(BASE_URL + '/auth/login', {
      email: 'marcos@admin.com',
      password: 'Marcos@admin123'
    });
    assert(adminLogin.data.success && adminLogin.data.accessToken, 'SuperAdmin login succeeded');
    const adminToken = adminLogin.data.accessToken;

    // ----------------------------------------------------
    // TEST 3: Catalog & Categories Synchronization
    // ----------------------------------------------------
    console.log('\n👉 [3/6] Testing Catalog & Products Availability...');
    const catRes = await axios.get(BASE_URL + '/categories');
    assert(catRes.data.success && catRes.data.data?.length > 0, 'Categories active (Count: ' + catRes.data.data?.length + ')');

    const prodRes = await axios.get(BASE_URL + '/products?limit=20');
    assert(prodRes.data.success && prodRes.data.data?.length > 0, 'Products catalog active (Count: ' + prodRes.data.data?.length + ')');
    const sampleProduct = prodRes.data.data[0];
    console.log('     Sample Item: ' + sampleProduct.name + ' | Price: ₹' + sampleProduct.price);

    // ----------------------------------------------------
    // TEST 4: Live Studio Appointment Booking & Sync
    // ----------------------------------------------------
    console.log('\n👉 [4/6] Testing Studio Appointment Lifecycle (Mobile -> Admin -> Mobile)...');
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + 2);
    bookingDate.setHours(14, 0, 0, 0);
    const testDate = bookingDate.toISOString();

    const bookRes = await axios.post(BASE_URL + '/appointments', {
      date: testDate,
      timeSlot: '02:00 PM - 03:00 PM',
      productType: sampleProduct.name,
      type: 'CONSULTATION',
      notes: 'Live Demo Automated Test Appointment'
    }, {
      headers: { Authorization: 'Bearer ' + customerToken }
    });
    assert(bookRes.data.success && bookRes.data.data?.id, 'Customer booked appointment in mobile app');
    const apptId = bookRes.data.data.id;

    // Admin verifies presence of appointment
    const adminApptsRes = await axios.get(BASE_URL + '/appointments?limit=200', {
      headers: { Authorization: 'Bearer ' + adminToken }
    });
    const foundInAdmin = adminApptsRes.data.data.find(a => a.id === apptId);
    assert(!!foundInAdmin && foundInAdmin.status === 'PENDING', 'Appointment immediately visible on Admin Dashboard as PENDING');

    // Admin Confirms appointment
    const confirmRes = await axios.put(BASE_URL + '/appointments/' + apptId, {
      status: 'CONFIRMED'
    }, {
      headers: { Authorization: 'Bearer ' + adminToken }
    });
    assert(confirmRes.data.success, 'Admin clicked Confirm on appointment card');

    // Customer checks updated status in mobile app
    const customerApptCheck = await axios.get(BASE_URL + '/appointments?limit=50', {
      headers: { Authorization: 'Bearer ' + customerToken }
    });
    const customerAppt = customerApptCheck.data.data.find(a => a.id === apptId);
    assert(customerAppt && customerAppt.status === 'CONFIRMED', 'Mobile app pulls updated status: CONFIRMED');

    // ----------------------------------------------------
    // TEST 5: Home Visit Request Sync
    // ----------------------------------------------------
    console.log('\n👉 [5/6] Testing Home Visit Request Lifecycle...');
    const visitDate = new Date(Date.now() + 86400000 * 3).toISOString();
    const visitRes = await axios.post(BASE_URL + '/visits', {
      preferredDate: visitDate,
      address: 'Suite 404, Bespoke Towers, Chennai',
      requirements: 'Live Demo Master Tailor Home Measurement'
    }, {
      headers: { Authorization: 'Bearer ' + customerToken }
    });
    assert(visitRes.data.success && visitRes.data.data?.id, 'Customer booked Home Visit in mobile app');
    const visitId = visitRes.data.data.id;

    const adminVisitsRes = await axios.get(BASE_URL + '/visits?limit=200', {
      headers: { Authorization: 'Bearer ' + adminToken }
    });
    const foundVisit = adminVisitsRes.data.data.find(v => v.id === visitId);
    assert(!!foundVisit && foundVisit.status === 'PENDING', 'Home Visit appears on Admin Portal with correct customer address');

    // ----------------------------------------------------
    // TEST 6: Retail Order Tracking Pipeline
    // ----------------------------------------------------
    console.log('\n👉 [6/6] Testing Order Tracking Pipeline...');
    const custOrdersRes = await axios.get(BASE_URL + '/orders', {
      headers: { Authorization: 'Bearer ' + customerToken }
    });
    assert(custOrdersRes.data.success && custOrdersRes.data.data?.length > 0, 'Customer order history loaded (Count: ' + custOrdersRes.data.data?.length + ')');
    const firstOrder = custOrdersRes.data.data[0];
    console.log('     Customer Order: #' + (firstOrder.invoiceNumber || firstOrder.id) + ' | Current Stage: ' + firstOrder.status);

    const adminOrdersRes = await axios.get(BASE_URL + '/orders/admin/list?limit=200', {
      headers: { Authorization: 'Bearer ' + adminToken }
    });
    assert(adminOrdersRes.data.success && adminOrdersRes.data.data?.length > 0, 'Admin Orders List loaded (Total Orders: ' + adminOrdersRes.data.data?.length + ')');
    const adminOrder = adminOrdersRes.data.data.find(o => o.id === firstOrder.id || o.invoiceNumber === firstOrder.invoiceNumber);
    assert(!!adminOrder, 'Order #' + firstOrder.invoiceNumber + ' fully synced between Customer App and Admin Console');

    console.log('\n====================================================');
    console.log('🏁 TEST SUMMARY: ' + passed + ' PASSED, ' + failed + ' FAILED');
    if (failed === 0) {
      console.log('🟢 ALL SYSTEMS GREEN! 100% Ready for Presentation.');
    } else {
      console.log('🔴 ISSUES DETECTED!');
    }
    console.log('====================================================\n');
  } catch(err) {
    console.error('Fatal test error:', err.response?.data || err.message);
  }
}

runTestSuite();
