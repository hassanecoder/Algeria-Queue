import { db } from "@workspace/db";
import {
  wilayasTable, communesTable,
  serviceCategoriesTable, officesTable, officeServicesTable,
  appointmentsTable
} from "@workspace/db/schema";
import { sql } from "drizzle-orm";

async function seed() {
  const seedMode = process.env.SEED_MODE === "bootstrap" ? "bootstrap" : "reset";
  console.log(`🌱 Seeding database in ${seedMode} mode...`);

  if (seedMode === "bootstrap") {
    const existing = await db.select().from(officesTable).limit(1);
    if (existing.length > 0) {
      console.log("Bootstrap seed skipped; offices already present");
      return;
    }
  }

  if (seedMode === "reset") {
    await db.execute(sql`TRUNCATE appointments, office_services, offices, communes, service_categories, wilayas RESTART IDENTITY CASCADE`);
  }

  // === WILAYAS ===
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

  const alger = insertedWilayas.find(w => w.code === "16")!;
  const oran = insertedWilayas.find(w => w.code === "31")!;
  const constantine = insertedWilayas.find(w => w.code === "25")!;
  const setif = insertedWilayas.find(w => w.code === "19")!;
  const blida = insertedWilayas.find(w => w.code === "09")!;
  const tizi = insertedWilayas.find(w => w.code === "15")!;
  const annaba = insertedWilayas.find(w => w.code === "23")!;

  await db.insert(communesTable).values([
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
    { wilayaId: oran.id, nameAr: "وهران المدينة", nameFr: "Oran Ville" },
    { wilayaId: oran.id, nameAr: "سيدي الشحمي", nameFr: "Sidi El Chemi" },
    { wilayaId: oran.id, nameAr: "البطيوة", nameFr: "Bethioua" },
    { wilayaId: constantine.id, nameAr: "قسنطينة المدينة", nameFr: "Constantine Ville" },
    { wilayaId: setif.id, nameAr: "سطيف", nameFr: "Sétif" },
    { wilayaId: blida.id, nameAr: "البليدة", nameFr: "Blida" },
    { wilayaId: tizi.id, nameAr: "تيزي وزو", nameFr: "Tizi Ouzou Ville" },
    { wilayaId: annaba.id, nameAr: "عنابة", nameFr: "Annaba Ville" },
  ]);
  console.log("✓ Communes inserted");

  // === SERVICE CATEGORIES — 100% private businesses ===
  const categories = await db.insert(serviceCategoriesTable).values([
    { nameAr: "طب وصحة", nameFr: "Santé & Cliniques", nameEn: "Health & Clinics", icon: "Stethoscope", description: "Cliniques privées, médecins généralistes, spécialistes et dentistes", color: "#0891B2" },
    { nameAr: "بنوك وتمويل", nameFr: "Banques & Finances", nameEn: "Banks & Finance", icon: "Landmark", description: "Ouverture de comptes, crédits, virements et services bancaires", color: "#2563EB" },
    { nameAr: "جمال وعناية", nameFr: "Beauté & Bien-être", nameEn: "Beauty & Wellness", icon: "Scissors", description: "Salons de coiffure, spas, soins esthétiques et massage", color: "#BE185D" },
    { nameAr: "ميكانيك وسيارات", nameFr: "Auto & Mécanique", nameEn: "Auto & Repair", icon: "Wrench", description: "Garages, vidanges, entretien et réparation automobile", color: "#D97706" },
    { nameAr: "قانون وتوثيق", nameFr: "Juridique & Notariat", nameEn: "Legal & Notary", icon: "Scale", description: "Avocats, notaires, huissiers et conseils juridiques", color: "#7C3AED" },
    { nameAr: "اتصالات وتقنية", nameFr: "Télécom & Tech", nameEn: "Telecom & Tech", icon: "Wifi", description: "Boutiques Ooredoo, Djezzy, Mobilis, réparation smartphone", color: "#059669" },
    { nameAr: "عقارات", nameFr: "Immobilier", nameEn: "Real Estate", icon: "Home", description: "Agences immobilières, estimation, location et achat", color: "#4F46E5" },
    { nameAr: "تعليم وتكوين", nameFr: "Éducation & Formation", nameEn: "Education", icon: "GraduationCap", description: "Centres de formation, auto-écoles, cours particuliers", color: "#B45309" },
  ]).returning();
  console.log(`✓ ${categories.length} categories inserted`);

  const [healthCat, bankCat, beautyCat, autoCat, legalCat, telecomCat, realEstateCat, eduCat] = categories;

  // === OFFICES — ALL PRIVATE BUSINESSES ===
  const offices = await db.insert(officesTable).values([
    // --- Health / Cliniques ---
    {
      name: "Clinique El Shifa",
      nameAr: "عيادة الشفاء",
      categoryId: healthCat.id, wilayaId: alger.id,
      address: "12 Rue Didouche Mourad, Alger Centre, Alger",
      phone: "021 73 45 12", openTime: "08:00", closeTime: "18:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Clinique médicale privée offrant consultations générales et spécialisées, bilan de santé et urgences mineures.",
      rating: 4.5,
    },
    {
      name: "Cabinet Dr. Benali — Dentiste",
      nameAr: "عيادة د. بن علي لطب الأسنان",
      categoryId: healthCat.id, wilayaId: alger.id,
      address: "45 Boulevard Krim Belkacem, El Biar, Alger",
      phone: "021 92 33 10", openTime: "09:00", closeTime: "17:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Cabinet dentaire moderne — soins dentaires, orthodontie, implants et blanchiment.",
      rating: 4.7,
    },
    {
      name: "Clinique Sania — Oran",
      nameAr: "عيادة سانيا - وهران",
      categoryId: healthCat.id, wilayaId: oran.id,
      address: "8 Rue Larbi Ben M'hidi, Oran",
      phone: "041 33 78 90", openTime: "08:00", closeTime: "17:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Clinique privée à Oran, spécialisée en médecine interne et cardiologie.",
      rating: 4.3,
    },
    {
      name: "Cabinet Dr. Meziane — Ophtalmologie",
      nameAr: "عيادة د. مزيان - طب العيون",
      categoryId: healthCat.id, wilayaId: constantine.id,
      address: "22 Rue Larbi Ben M'hidi, Constantine",
      phone: "031 94 11 55", openTime: "09:00", closeTime: "16:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Cabinet d'ophtalmologie — bilans visuels, lunettes et lentilles de contact.",
      rating: 4.6,
    },

    // --- Banks ---
    {
      name: "BNP Paribas El Djazaïr — Alger Centre",
      nameAr: "بنك باريبا الجزائر - الجزائر الوسطى",
      categoryId: bankCat.id, wilayaId: alger.id,
      address: "2 Boulevard Colonel Amirouche, Alger Centre",
      phone: "021 73 00 50", openTime: "08:30", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Agence bancaire — ouverture de compte, crédit immobilier, virements internationaux et épargne.",
      rating: 4.0,
    },
    {
      name: "Société Générale Algérie — Hydra",
      nameAr: "سوسيتي جنرال الجزائر - حيدرة",
      categoryId: bankCat.id, wilayaId: alger.id,
      address: "10 Chemin des Glycines, Hydra, Alger",
      phone: "021 54 80 00", openTime: "08:30", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Agence bancaire Société Générale — gestion de patrimoine, cartes bancaires et prêts personnels.",
      rating: 3.9,
    },
    {
      name: "BDL — Banque de Développement Local Oran",
      nameAr: "بنك التنمية المحلية - وهران",
      categoryId: bankCat.id, wilayaId: oran.id,
      address: "Boulevard de la Soummam, Oran",
      phone: "041 45 22 33", openTime: "08:30", closeTime: "15:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Agence BDL Oran — comptes courants, épargne, microfinance et crédits PME.",
      rating: 3.7,
    },

    // --- Beauty ---
    {
      name: "Salon Nour — Coiffure & Beauté",
      nameAr: "صالون نور - تصفيف الشعر والجمال",
      categoryId: beautyCat.id, wilayaId: alger.id,
      address: "18 Rue Hassiba Ben Bouali, Bab El Oued, Alger",
      phone: "0551 23 45 67", openTime: "09:00", closeTime: "19:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      description: "Salon de coiffure mixte — coupes, colorations, soins kératine et maquillage.",
      rating: 4.8,
    },
    {
      name: "Spa Zenith — Bien-être & Massage",
      nameAr: "سبا زينيث - استرخاء ومساج",
      categoryId: beautyCat.id, wilayaId: alger.id,
      address: "33 Cité Pins Maritimes, Ben Aknoun, Alger",
      phone: "0661 55 77 99", openTime: "10:00", closeTime: "20:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      description: "Centre de bien-être — massages relaxants, soins visage et corps, hammam et jacuzzi.",
      rating: 4.9,
    },
    {
      name: "Coiffure Amazigh — Tizi Ouzou",
      nameAr: "صالون أمازيغ - تيزي وزو",
      categoryId: beautyCat.id, wilayaId: tizi.id,
      address: "7 Rue de la Liberté, Tizi Ouzou",
      phone: "026 22 88 11", openTime: "09:00", closeTime: "18:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Salon de coiffure moderne pour hommes et femmes, spécialisé en coiffures traditionnelles et modernes.",
      rating: 4.4,
    },

    // --- Auto ---
    {
      name: "Garage Ben Aïssa — Mécanique Auto",
      nameAr: "كراج بن عيسى - ميكانيك السيارات",
      categoryId: autoCat.id, wilayaId: alger.id,
      address: "Zone Industrielle, El Harrach, Alger",
      phone: "021 52 33 44", openTime: "07:30", closeTime: "17:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Garage multi-marques — révision, vidange, freins, climatisation et diagnostic électronique.",
      rating: 4.2,
    },
    {
      name: "Centre Auto Toute Marque — Sétif",
      nameAr: "مركز صيانة السيارات - سطيف",
      categoryId: autoCat.id, wilayaId: setif.id,
      address: "Route de Constantine, Sétif",
      phone: "036 90 55 66", openTime: "08:00", closeTime: "17:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Centre de maintenance automobile — vidange, pneumatiques, carrosserie et électronique embarquée.",
      rating: 4.1,
    },

    // --- Legal ---
    {
      name: "Maître Haddad — Notaire",
      nameAr: "المعلم حداد - موثق",
      categoryId: legalCat.id, wilayaId: alger.id,
      address: "25 Rue Abane Ramdane, Alger Centre",
      phone: "021 73 88 22", openTime: "09:00", closeTime: "16:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Étude notariale — actes immobiliers, successions, contrats de mariage et procurations.",
      rating: 4.3,
    },
    {
      name: "Cabinet Juridique Ouali & Associés",
      nameAr: "مكتب والي وشركاه للمحاماة",
      categoryId: legalCat.id, wilayaId: oran.id,
      address: "15 Avenue de l'ANP, Oran",
      phone: "041 33 90 10", openTime: "09:00", closeTime: "17:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Cabinet d'avocats — droit commercial, droit de la famille, litiges et contentieux.",
      rating: 4.5,
    },

    // --- Telecom ---
    {
      name: "Boutique Ooredoo — Alger Centre",
      nameAr: "متجر أوريدو - الجزائر الوسطى",
      categoryId: telecomCat.id, wilayaId: alger.id,
      address: "5 Boulevard Khemisti, Alger Centre",
      phone: "0770 00 00 00", openTime: "08:30", closeTime: "17:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Boutique officielle Ooredoo — abonnements, recharges, smartphones et assistance technique.",
      rating: 3.8,
    },
    {
      name: "Djezzy Shop — Constantine",
      nameAr: "متجر جيزي - قسنطينة",
      categoryId: telecomCat.id, wilayaId: constantine.id,
      address: "Rue du 1er Novembre, Constantine",
      phone: "0770 11 22 33", openTime: "09:00", closeTime: "17:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Boutique officielle Djezzy — nouvelles lignes, internet 4G, forfaits et SAV.",
      rating: 3.9,
    },

    // --- Real Estate ---
    {
      name: "Agence Immo El Wifak — Alger",
      nameAr: "وكالة الوفاق العقارية - الجزائر",
      categoryId: realEstateCat.id, wilayaId: alger.id,
      address: "88 Boulevard Saïd Hamdine, Hydra, Alger",
      phone: "021 60 44 88", openTime: "09:00", closeTime: "17:30",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Agence immobilière — vente, achat, location appartements et villas, estimation gratuite.",
      rating: 4.1,
    },

    // --- Education ---
    {
      name: "Auto-École El Moukawil — Blida",
      nameAr: "مدرسة المقاول لتعليم السياقة - البليدة",
      categoryId: eduCat.id, wilayaId: blida.id,
      address: "12 Rue de l'Indépendance, Blida",
      phone: "025 41 77 33", openTime: "08:00", closeTime: "18:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"],
      description: "Auto-école agréée — formation code de la route, conduite manuelle et automatique.",
      rating: 4.3,
    },
    {
      name: "Centre de Formation Digit'Alg",
      nameAr: "مركز تكوين ديجيتال الجزائر",
      categoryId: eduCat.id, wilayaId: annaba.id,
      address: "Cité Universitaire, Route de la Corniche, Annaba",
      phone: "038 88 55 22", openTime: "09:00", closeTime: "18:00",
      workingDays: ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
      description: "Centre de formation professionnelle en informatique, réseaux, développement web et design.",
      rating: 4.6,
    },
  ]).returning();

  console.log(`✓ ${offices.length} offices inserted`);

  // === SERVICES ===
  const [clinicAlger, dentAlger, clinicOran, ophtConst, bnpAlger, sgAlger, bdlOran,
    salonNour, spaZenith, salonTizi, garageAlger, autoSetif, notaireAlger, cabinetOran,
    ooredooAlger, djezzyConst, immoAlger, autoEcoleBlida, formationAnnaba] = offices;

  await db.insert(officeServicesTable).values([
    // Clinique El Shifa
    { officeId: clinicAlger.id, nameAr: "استشارة طبية عامة", nameFr: "Consultation médecin généraliste", duration: 20, requiredDocuments: ["Carnet de santé ou ordonnances précédentes"], fee: 1500 },
    { officeId: clinicAlger.id, nameAr: "بيلان صحي شامل", nameFr: "Bilan de santé complet", duration: 60, requiredDocuments: ["Pièce d'identité", "Résultats d'analyses récents (si disponibles)"], fee: 5000 },
    { officeId: clinicAlger.id, nameAr: "استشارة طب الأطفال", nameFr: "Consultation pédiatre", duration: 25, requiredDocuments: ["Carnet de vaccination de l'enfant"], fee: 2000 },
    { officeId: clinicAlger.id, nameAr: "استشارة قلبية وعائية", nameFr: "Consultation cardiologue", duration: 30, requiredDocuments: ["Ordonnance médecin traitant", "Résultats ECG précédents"], fee: 3000 },

    // Dr. Benali Dentiste
    { officeId: dentAlger.id, nameAr: "فحص واستشارة الأسنان", nameFr: "Examen & consultation dentaire", duration: 20, requiredDocuments: [], fee: 1500 },
    { officeId: dentAlger.id, nameAr: "تنظيف الأسنان الاحترافي", nameFr: "Détartrage & nettoyage dentaire", duration: 45, requiredDocuments: [], fee: 3500 },
    { officeId: dentAlger.id, nameAr: "تبييض الأسنان", nameFr: "Blanchiment dentaire", duration: 60, requiredDocuments: [], fee: 8000 },
    { officeId: dentAlger.id, nameAr: "حشو الأسنان", nameFr: "Obturation (Plombage)", duration: 30, requiredDocuments: [], fee: 2500 },

    // Clinique Sania Oran
    { officeId: clinicOran.id, nameAr: "استشارة طبية عامة", nameFr: "Consultation généraliste", duration: 20, requiredDocuments: ["Carnet de santé"], fee: 1500 },
    { officeId: clinicOran.id, nameAr: "تخطيط القلب", nameFr: "Électrocardiogramme (ECG)", duration: 20, requiredDocuments: ["Ordonnance médicale"], fee: 2500 },
    { officeId: clinicOran.id, nameAr: "الأشعة السينية", nameFr: "Radiographie", duration: 15, requiredDocuments: ["Ordonnance médicale"], fee: 2000 },

    // Dr. Meziane Ophtalmologie
    { officeId: ophtConst.id, nameAr: "فحص البصر", nameFr: "Examen de la vue", duration: 25, requiredDocuments: ["Ancienne ordonnance (si disponible)"], fee: 2000 },
    { officeId: ophtConst.id, nameAr: "وصفة النظارات أو العدسات", nameFr: "Prescription lunettes/lentilles", duration: 20, requiredDocuments: [], fee: 1500 },

    // BNP Paribas
    { officeId: bnpAlger.id, nameAr: "فتح حساب بنكي", nameFr: "Ouverture de compte courant", duration: 30, requiredDocuments: ["CNI valide", "Justificatif de domicile", "Relevé de salaire (3 derniers mois)"], fee: 0 },
    { officeId: bnpAlger.id, nameAr: "طلب قرض شخصي", nameFr: "Demande de crédit à la consommation", duration: 45, requiredDocuments: ["CNI", "Fiches de paie", "Relevé bancaire"], fee: 0 },
    { officeId: bnpAlger.id, nameAr: "قرض عقاري", nameFr: "Demande de crédit immobilier", duration: 60, requiredDocuments: ["CNI", "Promesse de vente", "Fiches de paie 6 mois", "Avis d'imposition"], fee: 0 },
    { officeId: bnpAlger.id, nameAr: "خدمات بطاقة الدفع", nameFr: "Gestion carte bancaire (perte, renouvellement)", duration: 20, requiredDocuments: ["CNI", "Numéro de compte"], fee: 500 },

    // Société Générale
    { officeId: sgAlger.id, nameAr: "فتح حساب توفير", nameFr: "Ouverture compte épargne", duration: 25, requiredDocuments: ["CNI", "Justificatif de domicile"], fee: 0 },
    { officeId: sgAlger.id, nameAr: "استشارة إدارة الثروة", nameFr: "Conseil en gestion de patrimoine", duration: 60, requiredDocuments: ["CNI", "Justificatifs revenus et placements"], fee: 0 },

    // BDL Oran
    { officeId: bdlOran.id, nameAr: "فتح حساب جاري", nameFr: "Ouverture compte courant", duration: 30, requiredDocuments: ["CNI", "Justificatif de domicile"], fee: 0 },
    { officeId: bdlOran.id, nameAr: "قرض صغير للمؤسسات", nameFr: "Microfinancement PME/TPE", duration: 45, requiredDocuments: ["CNI", "Registre de commerce", "Bilan comptable"], fee: 0 },

    // Salon Nour
    { officeId: salonNour.id, nameAr: "قص الشعر (رجال)", nameFr: "Coupe homme", duration: 25, requiredDocuments: [], fee: 500 },
    { officeId: salonNour.id, nameAr: "قص الشعر (سيدات)", nameFr: "Coupe femme (lavage inclus)", duration: 45, requiredDocuments: [], fee: 1200 },
    { officeId: salonNour.id, nameAr: "صباغة الشعر", nameFr: "Coloration complète", duration: 90, requiredDocuments: [], fee: 3500 },
    { officeId: salonNour.id, nameAr: "كيراتين للشعر", nameFr: "Soin kératine", duration: 120, requiredDocuments: [], fee: 5000 },
    { officeId: salonNour.id, nameAr: "مكياج احترافي", nameFr: "Maquillage professionnel", duration: 60, requiredDocuments: [], fee: 3000 },

    // Spa Zenith
    { officeId: spaZenith.id, nameAr: "مساج استرخائي (٦٠ دقيقة)", nameFr: "Massage relaxant 60 min", duration: 60, requiredDocuments: [], fee: 3500 },
    { officeId: spaZenith.id, nameAr: "جلسة حمام بخار + مساج", nameFr: "Hammam + massage", duration: 90, requiredDocuments: [], fee: 5000 },
    { officeId: spaZenith.id, nameAr: "علاج الوجه", nameFr: "Soin visage anti-âge", duration: 60, requiredDocuments: [], fee: 4000 },

    // Salon Tizi
    { officeId: salonTizi.id, nameAr: "قص وتصفيف", nameFr: "Coupe & coiffage", duration: 30, requiredDocuments: [], fee: 600 },
    { officeId: salonTizi.id, nameAr: "تصفيف للمناسبات", nameFr: "Coiffure événementielle", duration: 75, requiredDocuments: [], fee: 2500 },

    // Garage Ben Aïssa
    { officeId: garageAlger.id, nameAr: "تغيير الزيت وفلتر", nameFr: "Vidange + filtre", duration: 30, requiredDocuments: ["Carte grise"], fee: 2500 },
    { officeId: garageAlger.id, nameAr: "فحص شامل للسيارة", nameFr: "Révision complète", duration: 90, requiredDocuments: ["Carte grise"], fee: 5000 },
    { officeId: garageAlger.id, nameAr: "إصلاح نظام الفرامل", nameFr: "Réparation freins", duration: 60, requiredDocuments: [], fee: 3500 },
    { officeId: garageAlger.id, nameAr: "إصلاح التكييف", nameFr: "Climatisation — recharge gaz", duration: 45, requiredDocuments: [], fee: 4000 },
    { officeId: garageAlger.id, nameAr: "تشخيص إلكتروني", nameFr: "Diagnostic électronique", duration: 30, requiredDocuments: [], fee: 1500 },

    // Auto Sétif
    { officeId: autoSetif.id, nameAr: "تغيير الزيت", nameFr: "Vidange huile moteur", duration: 30, requiredDocuments: [], fee: 2000 },
    { officeId: autoSetif.id, nameAr: "فحص الإطارات", nameFr: "Pneumatiques (montage + équilibrage)", duration: 45, requiredDocuments: [], fee: 1800 },

    // Notaire Haddad
    { officeId: notaireAlger.id, nameAr: "عقد بيع عقاري", nameFr: "Acte de vente immobilière", duration: 45, requiredDocuments: ["Titres de propriété", "CNI vendeur et acheteur", "Quitus fiscal", "Plans cadastraux"], fee: 0 },
    { officeId: notaireAlger.id, nameAr: "عقد زواج", nameFr: "Contrat de mariage", duration: 30, requiredDocuments: ["CNI des deux époux", "Actes de naissance", "Certificat de résidence"], fee: 3000 },
    { officeId: notaireAlger.id, nameAr: "توكيل رسمي", nameFr: "Procuration notariée", duration: 20, requiredDocuments: ["CNI du mandant et mandataire"], fee: 2000 },

    // Cabinet Juridique Oran
    { officeId: cabinetOran.id, nameAr: "استشارة قانونية", nameFr: "Consultation juridique (1h)", duration: 60, requiredDocuments: ["Documents liés au litige"], fee: 3000 },
    { officeId: cabinetOran.id, nameAr: "تمثيل قانوني أمام المحكمة", nameFr: "Représentation en justice", duration: 60, requiredDocuments: ["Pièce d'identité", "Dossier complet"], fee: 0 },

    // Ooredoo
    { officeId: ooredooAlger.id, nameAr: "اشتراك جديد (جوال/إنترنت)", nameFr: "Nouvelle souscription (mobile/internet)", duration: 20, requiredDocuments: ["CNI"], fee: 500 },
    { officeId: ooredooAlger.id, nameAr: "إصلاح وصيانة", nameFr: "SAV & réparation appareil", duration: 30, requiredDocuments: ["Preuve d'achat si disponible"], fee: 0 },
    { officeId: ooredooAlger.id, nameAr: "تغيير شريحة اتصال", nameFr: "Remplacement SIM / eSIM", duration: 15, requiredDocuments: ["CNI"], fee: 200 },

    // Djezzy
    { officeId: djezzyConst.id, nameAr: "خط جديد 4G", nameFr: "Ouverture ligne 4G", duration: 20, requiredDocuments: ["CNI"], fee: 500 },
    { officeId: djezzyConst.id, nameAr: "ترقية الباقة", nameFr: "Changement de forfait", duration: 10, requiredDocuments: ["CNI"], fee: 0 },

    // Immo El Wifak
    { officeId: immoAlger.id, nameAr: "تقدير قيمة العقار", nameFr: "Estimation immobilière gratuite", duration: 45, requiredDocuments: ["Titre de propriété ou bail"], fee: 0 },
    { officeId: immoAlger.id, nameAr: "عرض شراء أو استئجار", nameFr: "Visite & présentation bien immobilier", duration: 60, requiredDocuments: ["CNI"], fee: 0 },

    // Auto-école Blida
    { officeId: autoEcoleBlida.id, nameAr: "تسجيل في الكود", nameFr: "Inscription code de la route", duration: 20, requiredDocuments: ["CNI", "Photo d'identité", "Certificat médical"], fee: 5000 },
    { officeId: autoEcoleBlida.id, nameAr: "حصة قيادة", nameFr: "Séance de conduite (moniteur)", duration: 60, requiredDocuments: ["Livret d'apprentissage"], fee: 1500 },

    // Formation Annaba
    { officeId: formationAnnaba.id, nameAr: "دورة تطوير الويب", nameFr: "Formation développement web (HTML/CSS/JS)", duration: 60, requiredDocuments: ["CNI", "Diplôme BAC ou équivalent"], fee: 3000 },
    { officeId: formationAnnaba.id, nameAr: "دورة الشبكات والأمن", nameFr: "Formation réseaux & cybersécurité", duration: 60, requiredDocuments: ["CNI"], fee: 4000 },
  ]);
  console.log("✓ Services inserted");

  // === SAMPLE APPOINTMENTS ===
  const today = new Date().toISOString().split("T")[0];
  await db.insert(appointmentsTable).values([
    { ticketNumber: "DW-2026-10001", officeId: clinicAlger.id, serviceId: 1, citizenName: "Ahmed Benali", citizenPhone: "0551234567", citizenNationalId: "111222333444555", date: today, time: "09:00", status: "completed", queuePosition: 1, notes: "", calledAt: new Date(), completedAt: new Date() },
    { ticketNumber: "DW-2026-10002", officeId: clinicAlger.id, serviceId: 1, citizenName: "Fatima Saidi", citizenPhone: "0661234567", citizenNationalId: "222333444555666", date: today, time: "09:30", status: "completed", queuePosition: 2, notes: "", calledAt: new Date(), completedAt: new Date() },
    { ticketNumber: "DW-2026-10003", officeId: clinicAlger.id, serviceId: 2, citizenName: "Youcef Mammeri", citizenPhone: "0771234567", citizenNationalId: "333444555666777", date: today, time: "10:00", status: "in_progress", queuePosition: 3, notes: "", calledAt: new Date(), completedAt: null },
    { ticketNumber: "DW-2026-10004", officeId: clinicAlger.id, serviceId: 1, citizenName: "Nadia Bensalem", citizenPhone: "0591234567", citizenNationalId: "444555666777888", date: today, time: "10:30", status: "confirmed", queuePosition: 4, notes: "", calledAt: null, completedAt: null },
    { ticketNumber: "DW-2026-10005", officeId: salonNour.id, serviceId: 22, citizenName: "Meriem Hadj", citizenPhone: "0661111333", citizenNationalId: "555666777888999", date: today, time: "09:00", status: "confirmed", queuePosition: 1, notes: "", calledAt: null, completedAt: null },
    { ticketNumber: "DW-2026-10006", officeId: bnpAlger.id, serviceId: 14, citizenName: "Bilal Touati", citizenPhone: "0771112233", citizenNationalId: "666777888999000", date: today, time: "09:30", status: "pending", queuePosition: 1, notes: "", calledAt: null, completedAt: null },
    { ticketNumber: "DW-2026-10007", officeId: garageAlger.id, serviceId: 32, citizenName: "Karim Djebbar", citizenPhone: "0551111222", citizenNationalId: "777888999000111", date: today, time: "08:30", status: "completed", queuePosition: 1, notes: "", calledAt: new Date(), completedAt: new Date() },
    { ticketNumber: "DW-2026-10008", officeId: garageAlger.id, serviceId: 33, citizenName: "Said Boukhalfa", citizenPhone: "0661234888", citizenNationalId: "888999000111222", date: today, time: "09:00", status: "confirmed", queuePosition: 2, notes: "", calledAt: null, completedAt: null },
  ]);
  console.log("✓ Sample appointments inserted");
  console.log("🎉 Seed done!");
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
