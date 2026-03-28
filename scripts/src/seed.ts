import { db } from "@workspace/db";
import {
  wilayasTable, communesTable,
  serviceCategoriesTable, officesTable, officeServicesTable,
  appointmentsTable
} from "@workspace/db/schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear
  await db.execute(sql`TRUNCATE appointments, office_services, offices, communes, service_categories, wilayas RESTART IDENTITY CASCADE`);

  // === WILAYAS (58 of Algeria) ===
  const wilayasData = [
    { code: "01", nameAr: "أدرار", nameFr: "Adrar", region: "Sud" },
    { code: "02", nameAr: "الشلف", nameFr: "Chlef", region: "Nord-Ouest" },
    { code: "03", nameAr: "الأغواط", nameFr: "Laghouat", region: "Centre-Sud" },
    { code: "04", nameAr: "أم البواقي", nameFr: "Oum El Bouaghi", region: "Nord-Est" },
    { code: "05", nameAr: "باتنة", nameFr: "Batna", region: "Nord-Est" },
    { code: "06", nameAr: "بجاية", nameFr: "Béjaïa", region: "Nord-Est" },
    { code: "07", nameAr: "بسكرة", nameFr: "Biskra", region: "Centre-Sud" },
    { code: "08", nameAr: "بشار", nameFr: "Béchar", region: "Sud-Ouest" },
    { code: "09", nameAr: "البليدة", nameFr: "Blida", region: "Nord" },
    { code: "10", nameAr: "البويرة", nameFr: "Bouira", region: "Centre" },
    { code: "11", nameAr: "تمنراست", nameFr: "Tamanrasset", region: "Sud" },
    { code: "12", nameAr: "تبسة", nameFr: "Tébessa", region: "Nord-Est" },
    { code: "13", nameAr: "تلمسان", nameFr: "Tlemcen", region: "Nord-Ouest" },
    { code: "14", nameAr: "تيارت", nameFr: "Tiaret", region: "Nord-Ouest" },
    { code: "15", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou", region: "Centre" },
    { code: "16", nameAr: "الجزائر", nameFr: "Alger", region: "Nord" },
    { code: "17", nameAr: "الجلفة", nameFr: "Djelfa", region: "Centre-Sud" },
    { code: "18", nameAr: "جيجل", nameFr: "Jijel", region: "Nord-Est" },
    { code: "19", nameAr: "سطيف", nameFr: "Sétif", region: "Nord-Est" },
    { code: "20", nameAr: "سعيدة", nameFr: "Saïda", region: "Nord-Ouest" },
    { code: "21", nameAr: "سكيكدة", nameFr: "Skikda", region: "Nord-Est" },
    { code: "22", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès", region: "Nord-Ouest" },
    { code: "23", nameAr: "عنابة", nameFr: "Annaba", region: "Nord-Est" },
    { code: "24", nameAr: "قالمة", nameFr: "Guelma", region: "Nord-Est" },
    { code: "25", nameAr: "قسنطينة", nameFr: "Constantine", region: "Nord-Est" },
    { code: "26", nameAr: "المدية", nameFr: "Médéa", region: "Centre" },
    { code: "27", nameAr: "مستغانم", nameFr: "Mostaganem", region: "Nord-Ouest" },
    { code: "28", nameAr: "المسيلة", nameFr: "M'Sila", region: "Centre" },
    { code: "29", nameAr: "معسكر", nameFr: "Mascara", region: "Nord-Ouest" },
    { code: "30", nameAr: "ورقلة", nameFr: "Ouargla", region: "Sud-Est" },
    { code: "31", nameAr: "وهران", nameFr: "Oran", region: "Nord-Ouest" },
    { code: "32", nameAr: "البيض", nameFr: "El Bayadh", region: "Sud-Ouest" },
    { code: "33", nameAr: "إليزي", nameFr: "Illizi", region: "Sud-Est" },
    { code: "34", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arréridj", region: "Centre" },
    { code: "35", nameAr: "بومرداس", nameFr: "Boumerdès", region: "Centre" },
    { code: "36", nameAr: "الطارف", nameFr: "El Tarf", region: "Nord-Est" },
    { code: "37", nameAr: "تيندوف", nameFr: "Tindouf", region: "Extrême-Sud" },
    { code: "38", nameAr: "تيسمسيلت", nameFr: "Tissemsilt", region: "Nord-Ouest" },
    { code: "39", nameAr: "الوادي", nameFr: "El Oued", region: "Sud-Est" },
    { code: "40", nameAr: "خنشلة", nameFr: "Khenchela", region: "Nord-Est" },
    { code: "41", nameAr: "سوق أهراس", nameFr: "Souk Ahras", region: "Nord-Est" },
    { code: "42", nameAr: "تيبازة", nameFr: "Tipaza", region: "Nord" },
    { code: "43", nameAr: "ميلة", nameFr: "Mila", region: "Nord-Est" },
    { code: "44", nameAr: "عين الدفلى", nameFr: "Aïn Defla", region: "Nord" },
    { code: "45", nameAr: "النعامة", nameFr: "Naâma", region: "Sud-Ouest" },
    { code: "46", nameAr: "عين تموشنت", nameFr: "Aïn Témouchent", region: "Nord-Ouest" },
    { code: "47", nameAr: "غرداية", nameFr: "Ghardaïa", region: "Sud" },
    { code: "48", nameAr: "غليزان", nameFr: "Relizane", region: "Nord-Ouest" },
    { code: "49", nameAr: "تيميمون", nameFr: "Timimoun", region: "Sud" },
    { code: "50", nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar", region: "Sud" },
    { code: "51", nameAr: "أولاد جلال", nameFr: "Ouled Djellal", region: "Centre-Sud" },
    { code: "52", nameAr: "بني عباس", nameFr: "Béni Abbès", region: "Sud-Ouest" },
    { code: "53", nameAr: "عين صالح", nameFr: "In Salah", region: "Sud" },
    { code: "54", nameAr: "عين قزام", nameFr: "In Guezzam", region: "Extrême-Sud" },
    { code: "55", nameAr: "توقرت", nameFr: "Touggourt", region: "Sud-Est" },
    { code: "56", nameAr: "جانت", nameFr: "Djanet", region: "Extrême-Sud" },
    { code: "57", nameAr: "المغير", nameFr: "El M'Ghaier", region: "Sud-Est" },
    { code: "58", nameAr: "المنيعة", nameFr: "El Meniaa", region: "Sud" },
  ];

  const insertedWilayas = await db.insert(wilayasTable).values(wilayasData).returning();
  console.log(`✓ ${insertedWilayas.length} wilayas inserted`);

  // Communes for Alger (16) and Oran (31) and Constantine (25)
  const alger = insertedWilayas.find(w => w.code === "16")!;
  const oran = insertedWilayas.find(w => w.code === "31")!;
  const constantine = insertedWilayas.find(w => w.code === "25")!;
  const setif = insertedWilayas.find(w => w.code === "19")!;
  const blida = insertedWilayas.find(w => w.code === "09")!;

  const communesData = [
    // Alger
    { wilayaId: alger.id, nameAr: "الجزائر الوسطى", nameFr: "Alger Centre" },
    { wilayaId: alger.id, nameAr: "باب الوادي", nameFr: "Bab El Oued" },
    { wilayaId: alger.id, nameAr: "الأبيار", nameFr: "El Biar" },
    { wilayaId: alger.id, nameAr: "حيدرة", nameFr: "Hydra" },
    { wilayaId: alger.id, nameAr: "بن عكنون", nameFr: "Ben Aknoun" },
    { wilayaId: alger.id, nameAr: "الحراش", nameFr: "El Harrach" },
    { wilayaId: alger.id, nameAr: "باب الزوار", nameFr: "Bab Ezzouar" },
    { wilayaId: alger.id, nameAr: "بوزريعة", nameFr: "Bouzaréah" },
    { wilayaId: alger.id, nameAr: "الدار البيضاء", nameFr: "Dar El Beïda" },
    { wilayaId: alger.id, nameAr: "شراقة", nameFr: "Cheraga" },
    // Oran
    { wilayaId: oran.id, nameAr: "وهران المدينة", nameFr: "Oran Ville" },
    { wilayaId: oran.id, nameAr: "سيدي الشحمي", nameFr: "Sidi El Chemi" },
    { wilayaId: oran.id, nameAr: "البطيوة", nameFr: "Bethioua" },
    { wilayaId: oran.id, nameAr: "مرسى الكبير", nameFr: "Mers El Kébir" },
    // Constantine
    { wilayaId: constantine.id, nameAr: "قسنطينة المدينة", nameFr: "Constantine Ville" },
    { wilayaId: constantine.id, nameAr: "حامة بوزيان", nameFr: "Hamma Bouziane" },
    // Sétif
    { wilayaId: setif.id, nameAr: "سطيف", nameFr: "Sétif" },
    { wilayaId: setif.id, nameAr: "عين أرنات", nameFr: "Aïn Arnat" },
    // Blida
    { wilayaId: blida.id, nameAr: "البليدة", nameFr: "Blida" },
    { wilayaId: blida.id, nameAr: "البرواقية", nameFr: "Bougara" },
  ];

  await db.insert(communesTable).values(communesData);
  console.log(`✓ ${communesData.length} communes inserted`);

  // === SERVICE CATEGORIES ===
  const categories = await db.insert(serviceCategoriesTable).values([
    { nameAr: "الحالة المدنية", nameFr: "État Civil", nameEn: "Civil Registry", icon: "FileText", description: "Actes de naissance, mariage, décès et extraits de registre civil", color: "#2563EB" },
    { nameAr: "بطاقة الهوية والجواز", nameFr: "Carte Nationale & Passeport", nameEn: "ID & Passport", icon: "CreditCard", description: "Demande et renouvellement de carte nationale d'identité et passeport", color: "#7C3AED" },
    { nameAr: "الضرائب", nameFr: "Direction des Impôts", nameEn: "Tax Authority", icon: "Calculator", description: "Déclarations fiscales, NIF, attestations fiscales", color: "#059669" },
    { nameAr: "الضمان الاجتماعي", nameFr: "Sécurité Sociale (CNAS)", nameEn: "Social Security", icon: "Shield", description: "Immatriculation, remboursements, attestations CNAS", color: "#DC2626" },
    { nameAr: "خدمات البلدية", nameFr: "Services de la Commune (APC)", nameEn: "Municipality", icon: "Building2", description: "Permis de construire, conformités, certificats de résidence", color: "#D97706" },
    { nameAr: "خدمات الصحة", nameFr: "Établissements de Santé", nameEn: "Health Services", icon: "Heart", description: "Consultations, certificats médicaux, vaccination", color: "#0891B2" },
    { nameAr: "تسجيل المركبات", nameFr: "Carte Grise & Permis", nameEn: "Vehicle Registration", icon: "Car", description: "Immatriculation, transfert, carte grise et permis de conduire", color: "#4F46E5" },
    { nameAr: "وكالة التشغيل", nameFr: "ANEM - Emploi", nameEn: "Employment Agency", icon: "Briefcase", description: "Inscription chômage, offres d'emploi, formation professionnelle", color: "#BE185D" },
  ]).returning();
  console.log(`✓ ${categories.length} service categories inserted`);

  // === OFFICES ===
  const [civilCat, idCat, taxCat, ssCat, munCat, healthCat, carCat, anemCat] = categories;

  const offices = await db.insert(officesTable).values([
    // Alger - État Civil
    {
      name: "APC Alger Centre - État Civil",
      nameAr: "بلدية الجزائر الوسطى - الحالة المدنية",
      categoryId: civilCat.id, wilayaId: alger.id,
      address: "1 Rue Larbi Ben M'hidi, Alger Centre, Alger 16000",
      phone: "021 73 45 12", openTime: "08:00", closeTime: "16:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Service état civil de la commune d'Alger Centre. Délivrance de tous les actes d'état civil.",
      rating: 3.8,
    },
    // Alger - CNI/Passeport
    {
      name: "DLEP Alger - Carte Nationale & Passeport",
      nameAr: "مديرية الحريات العامة - بطاقة هوية وجواز سفر",
      categoryId: idCat.id, wilayaId: alger.id,
      address: "5 Avenue des Frères Bouadou, Hussein Dey, Alger 16009",
      phone: "021 49 30 00", openTime: "08:00", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Délivrance et renouvellement des cartes nationales d'identité et passeports pour la wilaya d'Alger.",
      rating: 3.5,
    },
    // Alger - Impôts
    {
      name: "DRI Alger Centre - Direction des Impôts",
      nameAr: "مديرية الضرائب - الجزائر الوسطى",
      categoryId: taxCat.id, wilayaId: alger.id,
      address: "42 Rue Belouizdad, Alger 16015",
      phone: "021 65 89 20", openTime: "08:30", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Centre des impôts pour les déclarations, NIF et attestations fiscales.",
      rating: 3.2,
    },
    // Alger - CNAS
    {
      name: "CNAS Alger El Madania",
      nameAr: "الصندوق الوطني للتأمينات الاجتماعية - المدنية",
      categoryId: ssCat.id, wilayaId: alger.id,
      address: "Cité El Madania, Route de Kouba, Alger 16050",
      phone: "021 56 12 44", openTime: "08:00", closeTime: "15:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Agence CNAS pour l'immatriculation, remboursements et prestations sociales.",
      rating: 3.6,
    },
    // Alger - APC
    {
      name: "APC Bab El Oued - Services Communaux",
      nameAr: "بلدية باب الوادي - الخدمات البلدية",
      categoryId: munCat.id, wilayaId: alger.id,
      address: "Rue Hassiba Ben Bouali, Bab El Oued, Alger 16001",
      phone: "021 97 63 10", openTime: "08:00", closeTime: "16:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Services municipaux de Bab El Oued: résidence, conformité, permis de construire.",
      rating: 3.4,
    },
    // Alger - Santé
    {
      name: "Polyclinique Bab El Oued",
      nameAr: "متعدد الخدمات الطبية - باب الوادي",
      categoryId: healthCat.id, wilayaId: alger.id,
      address: "Rue du Dr Benzerdjeb, Bab El Oued, Alger",
      phone: "021 96 44 22", openTime: "07:00", closeTime: "17:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Polyclinique offrant consultations, urgences et certificats médicaux.",
      rating: 4.1,
    },
    // Alger - Carte Grise
    {
      name: "Daïra Sidi M'Hamed - Carte Grise",
      nameAr: "دائرة سيدي محمد - بطاقة رمادية",
      categoryId: carCat.id, wilayaId: alger.id,
      address: "10 Rue du Stade, Sidi M'Hamed, Alger 16000",
      phone: "021 73 11 55", openTime: "08:00", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Immatriculation et transfert de véhicules, permis de conduire.",
      rating: 3.3,
    },
    // Alger - ANEM
    {
      name: "ANEM Alger Centre",
      nameAr: "وكالة التشغيل - الجزائر الوسطى",
      categoryId: anemCat.id, wilayaId: alger.id,
      address: "25 Rue Hassiba Ben Bouali, Alger 16000",
      phone: "021 73 29 87", openTime: "08:00", closeTime: "15:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Agence nationale pour l'emploi: inscription, allocations chômage, offres d'emploi.",
      rating: 3.0,
    },
    // Oran - État Civil
    {
      name: "APC Oran - État Civil",
      nameAr: "بلدية وهران - الحالة المدنية",
      categoryId: civilCat.id, wilayaId: oran.id,
      address: "Place du 1er Novembre, Oran 31000",
      phone: "041 33 22 11", openTime: "08:00", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "État civil de la commune d'Oran.",
      rating: 3.7,
    },
    // Oran - CNAS
    {
      name: "CNAS Oran",
      nameAr: "الصندوق الوطني للتأمينات الاجتماعية - وهران",
      categoryId: ssCat.id, wilayaId: oran.id,
      address: "Boulevard Millénium, Oran 31000",
      phone: "041 45 67 89", openTime: "08:00", closeTime: "15:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Agence CNAS Oran pour toutes les prestations sociales.",
      rating: 3.4,
    },
    // Constantine - État Civil
    {
      name: "APC Constantine - État Civil",
      nameAr: "بلدية قسنطينة - الحالة المدنية",
      categoryId: civilCat.id, wilayaId: constantine.id,
      address: "Place des Martyrs, Constantine 25000",
      phone: "031 94 55 00", openTime: "08:00", closeTime: "16:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "État civil de la commune de Constantine.",
      rating: 3.9,
    },
    // Constantine - Impôts
    {
      name: "DRI Constantine - Impôts",
      nameAr: "مديرية الضرائب - قسنطينة",
      categoryId: taxCat.id, wilayaId: constantine.id,
      address: "Rue de France, Constantine 25000",
      phone: "031 94 61 20", openTime: "08:30", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Direction des impôts de Constantine.",
      rating: 3.1,
    },
    // Sétif - État Civil
    {
      name: "APC Sétif - État Civil",
      nameAr: "بلدية سطيف - الحالة المدنية",
      categoryId: civilCat.id, wilayaId: setif.id,
      address: "Place de l'Indépendance, Sétif 19000",
      phone: "036 90 22 33", openTime: "08:00", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "État civil de la wilaya de Sétif.",
      rating: 4.0,
    },
    // Blida - Santé
    {
      name: "CHU Blida - Consultations Externes",
      nameAr: "مستشفى البليدة الجامعي - الاستشارات الخارجية",
      categoryId: healthCat.id, wilayaId: blida.id,
      address: "Route de Boufarik, Blida 09000",
      phone: "025 39 12 66", openTime: "07:30", closeTime: "16:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "CHU Blida, consultations spécialisées et urgences.",
      rating: 4.2,
    },
  ]).returning();

  console.log(`✓ ${offices.length} offices inserted`);

  // === OFFICE SERVICES ===
  const apcAlger = offices[0];
  const dlepAlger = offices[1];
  const driAlger = offices[2];
  const cnasAlger = offices[3];
  const apcBabElOued = offices[4];
  const polyBabElOued = offices[5];
  const carteGriseAlger = offices[6];
  const anemAlger = offices[7];
  const apcOran = offices[8];
  const cnasOran = offices[9];
  const apcConstantine = offices[10];
  const driConstantine = offices[11];
  const apcSetif = offices[12];
  const chuBlida = offices[13];

  await db.insert(officeServicesTable).values([
    // APC Alger Centre - État Civil
    { officeId: apcAlger.id, nameAr: "شهادة الميلاد", nameFr: "Extrait de naissance", duration: 10, requiredDocuments: ["Acte de naissance original", "Pièce d'identité du demandeur"], fee: 0 },
    { officeId: apcAlger.id, nameAr: "شهادة الزواج", nameFr: "Acte de mariage", duration: 10, requiredDocuments: ["Livret de famille", "Pièce d'identité"], fee: 0 },
    { officeId: apcAlger.id, nameAr: "شهادة الوفاة", nameFr: "Acte de décès", duration: 10, requiredDocuments: ["Acte de naissance du défunt", "Pièce d'identité"], fee: 0 },
    { officeId: apcAlger.id, nameAr: "شهادة العيش", nameFr: "Certificat de vie", duration: 5, requiredDocuments: ["Pièce d'identité nationale"], fee: 0 },
    { officeId: apcAlger.id, nameAr: "بطاقة العائلة", nameFr: "Livret de famille", duration: 20, requiredDocuments: ["Acte de mariage", "Actes de naissance des enfants", "CNI des époux"], fee: 0 },

    // DLEP - CNI & Passeport
    { officeId: dlepAlger.id, nameAr: "طلب بطاقة الهوية الوطنية", nameFr: "Demande CNI", duration: 20, requiredDocuments: ["Acte de naissance (moins de 3 mois)", "Justificatif de domicile", "2 photos d'identité", "Ancienne CNI (si renouvellement)"], fee: 0 },
    { officeId: dlepAlger.id, nameAr: "تجديد بطاقة الهوية الوطنية", nameFr: "Renouvellement CNI", duration: 15, requiredDocuments: ["Ancienne CNI", "Acte de naissance récent", "Justificatif de domicile"], fee: 0 },
    { officeId: dlepAlger.id, nameAr: "طلب جواز السفر", nameFr: "Demande Passeport", duration: 25, requiredDocuments: ["CNI valide", "Acte de naissance récent", "Justificatif de domicile", "3 photos d'identité", "Timbre fiscal 6000 DA"], fee: 6000 },
    { officeId: dlepAlger.id, nameAr: "تجديد جواز السفر", nameFr: "Renouvellement Passeport", duration: 20, requiredDocuments: ["Ancien passeport", "CNI valide", "2 photos", "Timbre fiscal 6000 DA"], fee: 6000 },

    // DRI Alger - Impôts
    { officeId: driAlger.id, nameAr: "الحصول على رقم التعريف الجبائي", nameFr: "Demande de NIF", duration: 20, requiredDocuments: ["RC ou acte de naissance", "Justificatif d'activité", "CNI"], fee: 0 },
    { officeId: driAlger.id, nameAr: "شهادة التسوية الجبائية", nameFr: "Attestation de mise en conformité fiscale", duration: 15, requiredDocuments: ["NIF", "CNI ou RC", "Dernière déclaration fiscale"], fee: 0 },
    { officeId: driAlger.id, nameAr: "التصريح السنوي بالضريبة", nameFr: "Dépôt déclaration IRG annuelle", duration: 30, requiredDocuments: ["Formulaire G50", "Justificatifs de revenus", "NIF"], fee: 0 },

    // CNAS Alger
    { officeId: cnasAlger.id, nameAr: "التسجيل في الضمان الاجتماعي", nameFr: "Immatriculation CNAS", duration: 20, requiredDocuments: ["Acte de naissance", "CNI", "Contrat de travail ou attestation patronale"], fee: 0 },
    { officeId: cnasAlger.id, nameAr: "شهادة التأمين الاجتماعي", nameFr: "Attestation d'assurance sociale", duration: 10, requiredDocuments: ["Numéro d'assuré", "CNI"], fee: 0 },
    { officeId: cnasAlger.id, nameAr: "طلب استرداد المصاريف الطبية", nameFr: "Demande de remboursement médical", duration: 15, requiredDocuments: ["Ordonnances originales", "Factures pharmacie", "CNI", "RIB bancaire"], fee: 0 },

    // APC Bab El Oued
    { officeId: apcBabElOued.id, nameAr: "شهادة الإقامة", nameFr: "Certificat de résidence", duration: 10, requiredDocuments: ["CNI", "Justificatif de domicile (quittance ou acte de propriété)"], fee: 0 },
    { officeId: apcBabElOued.id, nameAr: "رخصة البناء", nameFr: "Permis de construire", duration: 40, requiredDocuments: ["Plan de masse", "Titre de propriété", "CNI", "Étude technique"], fee: 3000 },
    { officeId: apcBabElOued.id, nameAr: "شهادة الاستلام", nameFr: "Certificat de conformité", duration: 30, requiredDocuments: ["Permis de construire", "Rapport de fin de travaux", "CNI"], fee: 1500 },

    // Polyclinique Bab El Oued
    { officeId: polyBabElOued.id, nameAr: "استشارة طبية عامة", nameFr: "Consultation médecine générale", duration: 15, requiredDocuments: ["Carnet de santé", "Carte CNAS"], fee: 0 },
    { officeId: polyBabElOued.id, nameAr: "شهادة طبية", nameFr: "Certificat médical", duration: 10, requiredDocuments: ["CNI", "Carnet de santé"], fee: 200 },
    { officeId: polyBabElOued.id, nameAr: "تطعيم", nameFr: "Vaccination", duration: 10, requiredDocuments: ["Carnet de vaccination", "CNI"], fee: 0 },

    // Carte Grise
    { officeId: carteGriseAlger.id, nameAr: "تسجيل مركبة جديدة", nameFr: "Immatriculation véhicule neuf", duration: 25, requiredDocuments: ["Facture d'achat", "Attestation d'assurance", "CNI", "Bon de livraison"], fee: 5000 },
    { officeId: carteGriseAlger.id, nameAr: "نقل ملكية مركبة", nameFr: "Mutation carte grise (véhicule occasion)", duration: 30, requiredDocuments: ["Ancienne carte grise", "Contrat de vente légalisé", "CNI acheteur", "Assurance", "Quitus fiscal"], fee: 3500 },
    { officeId: carteGriseAlger.id, nameAr: "طلب رخصة السياقة", nameFr: "Permis de conduire", duration: 20, requiredDocuments: ["Certificat médical aptitude", "CNI", "Photos", "Attestation d'école de conduite"], fee: 4000 },

    // ANEM
    { officeId: anemAlger.id, nameAr: "التسجيل في وكالة التشغيل", nameFr: "Inscription chômeur ANEM", duration: 15, requiredDocuments: ["CNI", "Diplômes", "Anciens contrats de travail", "RIB"], fee: 0 },
    { officeId: anemAlger.id, nameAr: "تجديد بطاقة العمل", nameFr: "Renouvellement inscription ANEM", duration: 10, requiredDocuments: ["Ancienne carte ANEM", "CNI"], fee: 0 },

    // APC Oran
    { officeId: apcOran.id, nameAr: "شهادة الميلاد", nameFr: "Extrait de naissance", duration: 10, requiredDocuments: ["Acte de naissance original", "CNI"], fee: 0 },
    { officeId: apcOran.id, nameAr: "شهادة الإقامة", nameFr: "Certificat de résidence", duration: 10, requiredDocuments: ["CNI", "Justificatif de domicile"], fee: 0 },
    { officeId: apcOran.id, nameAr: "شهادة العيش", nameFr: "Certificat de vie", duration: 5, requiredDocuments: ["CNI"], fee: 0 },

    // CNAS Oran
    { officeId: cnasOran.id, nameAr: "شهادة التأمين الاجتماعي", nameFr: "Attestation d'assurance sociale", duration: 10, requiredDocuments: ["Numéro assuré", "CNI"], fee: 0 },
    { officeId: cnasOran.id, nameAr: "طلب استرداد المصاريف الطبية", nameFr: "Remboursement médical", duration: 15, requiredDocuments: ["Ordonnances", "Factures", "CNI", "RIB"], fee: 0 },

    // APC Constantine
    { officeId: apcConstantine.id, nameAr: "شهادة الميلاد", nameFr: "Extrait de naissance", duration: 10, requiredDocuments: ["Acte de naissance", "CNI"], fee: 0 },
    { officeId: apcConstantine.id, nameAr: "بطاقة العائلة", nameFr: "Livret de famille", duration: 20, requiredDocuments: ["Acte de mariage", "CNI des deux époux"], fee: 0 },

    // DRI Constantine
    { officeId: driConstantine.id, nameAr: "الحصول على رقم التعريف الجبائي", nameFr: "Demande NIF", duration: 20, requiredDocuments: ["CNI", "Justificatif activité"], fee: 0 },
    { officeId: driConstantine.id, nameAr: "شهادة التسوية الجبائية", nameFr: "Attestation de conformité fiscale", duration: 15, requiredDocuments: ["NIF", "CNI", "Dernière déclaration"], fee: 0 },

    // APC Sétif
    { officeId: apcSetif.id, nameAr: "شهادة الميلاد", nameFr: "Extrait de naissance", duration: 10, requiredDocuments: ["Acte de naissance", "CNI"], fee: 0 },
    { officeId: apcSetif.id, nameAr: "شهادة الإقامة", nameFr: "Certificat de résidence", duration: 10, requiredDocuments: ["CNI", "Justificatif domicile"], fee: 0 },

    // CHU Blida
    { officeId: chuBlida.id, nameAr: "استشارة تخصصية", nameFr: "Consultation spécialisée", duration: 20, requiredDocuments: ["Ordonnance médecin traitant", "Carte CNAS", "Carnet de santé"], fee: 0 },
    { officeId: chuBlida.id, nameAr: "استشارة طبية عامة", nameFr: "Consultation médecine générale", duration: 15, requiredDocuments: ["Carnet de santé", "Carte CNAS"], fee: 0 },
    { officeId: chuBlida.id, nameAr: "شهادة طبية", nameFr: "Certificat médical", duration: 10, requiredDocuments: ["CNI", "Carnet de santé"], fee: 200 },
  ]);

  console.log("✓ Office services inserted");

  // === SAMPLE APPOINTMENTS ===
  const today = new Date().toISOString().split("T")[0];
  const sampleAppointments = [
    { ticketNumber: "DZ-2026-10001", officeId: apcAlger.id, serviceId: 1, citizenName: "Ahmed Benali", citizenPhone: "0551234567", citizenNationalId: "16001234567890123", date: today, time: "09:00", status: "completed", queuePosition: 1 },
    { ticketNumber: "DZ-2026-10002", officeId: apcAlger.id, serviceId: 1, citizenName: "Fatima Saidi", citizenPhone: "0661234567", citizenNationalId: "16009876543210987", date: today, time: "09:30", status: "completed", queuePosition: 2 },
    { ticketNumber: "DZ-2026-10003", officeId: apcAlger.id, serviceId: 2, citizenName: "Youcef Mammeri", citizenPhone: "0771234567", citizenNationalId: "16001122334455667", date: today, time: "10:00", status: "in_progress", queuePosition: 3 },
    { ticketNumber: "DZ-2026-10004", officeId: apcAlger.id, serviceId: 1, citizenName: "Nadia Bensalem", citizenPhone: "0591234567", citizenNationalId: "16007788990011223", date: today, time: "10:30", status: "confirmed", queuePosition: 4 },
    { ticketNumber: "DZ-2026-10005", officeId: apcAlger.id, serviceId: 4, citizenName: "Karim Djebbar", citizenPhone: "0551111222", citizenNationalId: "16003344556677889", date: today, time: "11:00", status: "confirmed", queuePosition: 5 },
    { ticketNumber: "DZ-2026-10006", officeId: dlepAlger.id, serviceId: 6, citizenName: "Meriem Hadj", citizenPhone: "0661111333", citizenNationalId: "16005566778899001", date: today, time: "09:00", status: "confirmed", queuePosition: 1 },
    { ticketNumber: "DZ-2026-10007", officeId: dlepAlger.id, serviceId: 8, citizenName: "Bilal Touati", citizenPhone: "0771112233", citizenNationalId: "16001234554321098", date: today, time: "09:30", status: "pending", queuePosition: 2 },
    { ticketNumber: "DZ-2026-10008", officeId: cnasAlger.id, serviceId: 13, citizenName: "Houria Meziane", citizenPhone: "0551234999", citizenNationalId: "16009988776655443", date: today, time: "08:30", status: "completed", queuePosition: 1 },
    { ticketNumber: "DZ-2026-10009", officeId: cnasAlger.id, serviceId: 15, citizenName: "Said Boukhalfa", citizenPhone: "0661234888", citizenNationalId: "16002233445566778", date: today, time: "09:00", status: "confirmed", queuePosition: 2 },
  ];

  await db.insert(appointmentsTable).values(sampleAppointments.map(a => ({
    ...a,
    notes: "",
    calledAt: a.status === "in_progress" || a.status === "completed" ? new Date() : null,
    completedAt: a.status === "completed" ? new Date() : null,
  })));

  console.log(`✓ ${sampleAppointments.length} sample appointments inserted`);
  console.log("🎉 Database seeded successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
