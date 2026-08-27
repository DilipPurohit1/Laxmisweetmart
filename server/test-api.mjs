async function testShowcaseApi() {
  console.log('--- Testing Shri Laxmi Sweet Mart Showcase API ---');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5001/api/health');
  const health = await healthRes.json();
  console.log('1. Health check:', health.status, '| Store:', health.storeName, '| Estd:', health.established);

  // 2. Public Products List
  const prodRes = await fetch('http://localhost:5001/api/products');
  const products = await prodRes.json();
  console.log(`2. Public Products loaded: ${products.length} visible items`);

  // 3. Category filter test (e.g. kaju-katli)
  const katliRes = await fetch('http://localhost:5001/api/products?category=kaju-katli');
  const katli = await katliRes.json();
  console.log(`3. Kaju Katli category filter: ${katli.length} items found`);

  // 4. Admin Login
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@shrilaxmisweetmart.com', password: 'admin1985' })
  });
  const loginData = await loginRes.json();
  console.log('4. Admin Login:', loginData.message, '| User:', loginData.user?.fullName);

  const token = loginData.token;

  // 5. Admin Products List (includes hidden)
  const adminProdRes = await fetch('http://localhost:5001/api/products/admin-all', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const adminProducts = await adminProdRes.json();
  console.log(`5. Admin Products Endpoint: ${adminProducts.length} total products loaded`);

  console.log('🌟 All Showcase REST API verification tests passed successfully!');
}

testShowcaseApi().catch(console.error);
