import { MaterialCategory, PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function createUsers() {
  const users: {
    email: string;
    role: UserRole;
  }[] = [
      { email: 'srinulikitha526@gmail.com', role: 'STORE_INCHARGE' },
      { email: 'anbumani@gtb.in', role: 'PROCUREMENT_MANAGER' },
      { email: 'gopi.m@gtb.in', role: 'ACCOUNTS_MANAGER' },
      { email: 'vijay@gtb.in', role: 'ADMIN' }
    ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: 'Gtc@123',
        role: user.role,
      },
    });
  }
}

createUsers()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    console.log("Created Users");
    await prisma.$disconnect();
  });

// remove this in prod
// import { faker } from "@faker-js/faker";

// async function createFakeData() {
//   // Number of fake invoices to create
//   const invoiceCount = 20;

//   for (let i = 0; i < invoiceCount; i++) {
//     // Create fake invoice
//     const invoice = await prisma.materialInvoice.create({
//       data: {
//         dateOfReceipt: faker.date.recent({ days: 30 }),
//         vendorName: faker.company.name(),
//         invoiceNumber: faker.string.alphanumeric(8).toUpperCase(),
//         invoiceDate: faker.date.past({ years: 1 }),
//         deliveryChallanNumber: faker.string.alphanumeric(6).toUpperCase(),
//         vehicleNumber: `MH-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha(2).toUpperCase()}-${faker.number.int({ min: 1000, max: 9999 })}`,
//         materialCategory: faker.helpers.arrayElement([
//           "CIVIL",
//           "PLUMBING",
//           "ELECTRICAL",
//           "INTERIOR",
//           "EXTERIOR",
//           "OTHER",
//         ]) as MaterialCategory,
//         hnsCode: faker.string.alphanumeric(6),
//         uom: faker.helpers.arrayElement(["KG", "Litre", "Nos", "Meter"]),
//         vendorContactNumber: faker.phone.number(),
//         poNumber: `PO-${faker.number.int({ min: 1000, max: 9999 })}`,
//         poDate: faker.date.past({ years: 1 }),
//         purposeOfMaterial: faker.commerce.productAdjective(),
//         invoiceAttachment: faker.internet.url(),
//         mrnNumber: `MRN-${faker.number.int({ min: 100, max: 999 })}`,
//         ginNumber: `GIN-${faker.number.int({ min: 100, max: 999 })}`,

//         approved: faker.datatype.boolean(),
//         paid: faker.datatype.boolean(),
//         paidOn: faker.date.recent({ days: 10 }),
//         remarks: faker.lorem.sentence(),

//       },
//     });

//     // Create fake invoice items for this invoice
//     const itemsCount = faker.number.int({ min: 2, max: 5 });
//     for (let j = 0; j < itemsCount; j++) {
//       const qty = faker.number.float({ min: 1, max: 100, fractionDigits: 2 });
//       const rate = faker.number.float({ min: 50, max: 1000, fractionDigits: 2 });

//       console.log("invoice item payload", {
//         materialInvoiceId: invoice.id,
//         category: "CIVIL",
//         hnsCode: "ABC123",
//         description: "Test",
//         quantity: qty,
//         ratePerUnit: rate,
//         cost: qty * rate,
//       });

//       await prisma.invoiceMaterialItem.create({
//         data: {
//           materialInvoiceId: invoice.id, // ✅ valid relation
//           category: "CIVIL",
//           hnsCode: faker.string.alphanumeric(6).toUpperCase(),
//           description: faker.commerce.productName(),
//           quantity: qty,
//           ratePerUnit: rate,
//           cost: Number((qty * rate).toFixed(2)), // ✅ no NaN
//         },
//       });

//     }
//   }

//   // Create fake DC Entries
//   const dcEntriesCount = 20;
//   for (let i = 0; i < dcEntriesCount; i++) {
//     await prisma.dcEntry.create({
//       data: {
//         dateOfReceipt: faker.date.recent({ days: 20 }),
//         vendorName: faker.company.name(),
//         dcNumber: `DC-${faker.number.int({ min: 1000, max: 9999 })}`,
//         vehicleNumber: `MH-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha(2).toUpperCase()}-${faker.number.int({ min: 1000, max: 9999 })}`,
//         materialDescription: faker.commerce.productName(),
//         uom: faker.helpers.arrayElement(["KG", "Litre", "Nos", "Meter"]),
//         receivedQuantity: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
//         purposeOfMaterial: faker.commerce.productAdjective(),
//         dcAttachment: faker.internet.url(),
//         bmrnNumber: `BMRN-${faker.number.int({ min: 100, max: 999 })}`,

//         approved: faker.datatype.boolean(),

//       },
//     });
//   }

//   console.log("✅ Fake data seeded successfully!");
// }

// createFakeData()
//   .catch((e) => {
//     console.error(e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });