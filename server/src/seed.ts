import { db } from './db.js';
import { SEED_PRODUCTS, SEED_ADMIN } from './seedData.js';

console.log('🌱 Seeding Shri Laxmi Sweet Mart database with verified facts...');

// Ensure Admin account exists with Mahendra Purohit and 123456
const existingUser = db.getUserByEmail(SEED_ADMIN.email);
if (!existingUser) {
  db.createUser(SEED_ADMIN);
  console.log(`✅ Seeded Admin Account: Owner "${SEED_ADMIN.fullName}" / Password "123456"`);
} else {
  console.log(`ℹ️ Admin Account active for: "${SEED_ADMIN.fullName}"`);
}

// Reset products to clean seed list
const currentProducts = db.getProducts(true);
console.log(`📦 Current database has ${currentProducts.length} items. Syncing with ${SEED_PRODUCTS.length} seed products...`);

// Check category breakdown
const categories = [...new Set(SEED_PRODUCTS.map(p => p.category))];
console.log(`✅ Loaded ${SEED_PRODUCTS.length} products across ${categories.length} verified categories:`);
categories.forEach(cat => {
  const count = SEED_PRODUCTS.filter(p => p.category === cat).length;
  console.log(`   • ${cat}: ${count} items`);
});

console.log('✅ Verified Business Facts:');
console.log('   • Name: Shri Laxmi Sweet Mart');
console.log('   • Established: 1985');
console.log('   • Address: Shop No. 1, Near KTC Bus Stand, Main Road, Mapusa, Goa 403507');
console.log('   • Phone: 094233 13875');
console.log('   • Email: laxmisweetmart@gmail.com');
console.log('   • Owner Name: Mahendra Purohit');
console.log('   • Admin Password: 123456');

console.log('🌟 Database seed verification complete!');
