export type Lang = "en" | "om" | "am";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  om: "Afaan Oromo",
  am: "አማርኛ",
};

export type TranslationMap = {
  brandName: string;
  brandTag: string;
  nav: {
    story: string;
    journeys: string;
    services: string;
    faq: string;
    plan: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  servicesSection: {
    kicker: string;
    title: string;
    intro: string;
  };
  services: { title: string; detail: string }[];
  passport: {
    title: string;
    urgent: string;
    urgent2: string;
    urgent5: string;
    normal: string;
    required: string;
    docs: string[];
  };
  extraServices: string[];
  contact: {
    callUs: string;
    whatsapp: string;
    phones: string[];
    thanks: string;
  };
  faq: { q: string; a: string }[];
  footer: {
    tagline: string;
    details: string;
    disclaimer: string;
    back: string;
  };
  enquire: {
    title: string;
    name: string;
    phone: string;
    email: string;
    journey: string;
    when: string;
    travelers: string;
    note: string;
    submit: string;
  };
  admin: {
    title: string;
    login: string;
    password: string;
    save: string;
    logout: string;
    hint: string;
  };
};

export const translations: Record<Lang, TranslationMap> = {
  en: {
    brandName: "Idris Tour",
    brandTag: "& Travel · Addis Ababa",
    nav: {
      story: "Our story",
      journeys: "Journeys",
      services: "Travel services",
      faq: "Good to know",
      plan: "Plan a journey",
    },
    hero: {
      kicker: "From Ethiopia to the world",
      title: "Your journey, our priority",
      subtitle:
        "Passport services, Umrah, international flights, hotels, visas and complete travel support — ready without hassle.",
      cta: "See services",
    },
    servicesSection: {
      kicker: "What we offer",
      title: "Services you will find with us",
      intro:
        "We help people who want to travel abroad. Many face special difficulties getting a passport. We are fully prepared to welcome you without any problem.",
    },
    services: [
      {
        title: "Passport services",
        detail:
          "Urgent passport (2-day or 5-day) and normal service. Required: birth certificate, ID card, National ID.",
      },
      {
        title: "COC in 24 hours",
        detail: "Certificate of Competence prepared for you within 24 hours.",
      },
      {
        title: "Police clearance",
        detail: "Police clearance certificate assistance and processing.",
      },
      {
        title: "Medical appointment",
        detail: "Medical appointment booking for travel requirements.",
      },
      {
        title: "ILMS & flight tickets",
        detail: "ILMS support and flight tickets at reasonable prices.",
      },
      {
        title: "Arab country visas",
        detail: "Visa processing for people traveling to Arab countries.",
      },
    ],
    passport: {
      title: "Passport types",
      urgent: "Urgent Passport",
      urgent2: "2-day service",
      urgent5: "5-day service",
      normal: "Normal service",
      required: "Documents required",
      docs: ["Birth certificate", "ID card / Identity document", "National ID"],
    },
    extraServices: [
      "COC within 24 hours",
      "Police clearance",
      "Medical appointment",
      "ILMS",
      "Flight tickets at fair prices",
      "Visas for Arab countries",
    ],
    contact: {
      callUs: "Call us from wherever you are",
      whatsapp: "WhatsApp",
      phones: ["+251 922 00 53 74", "+251 949 89 21 93"],
      thanks: "Thank you",
    },
    faq: [
      {
        q: "Do you arrange urgent passports?",
        a: "Yes. We offer 2-day and 5-day urgent passport services as well as normal processing. Bring birth certificate, identity document and National ID.",
      },
      {
        q: "Can you help with Arab country visas?",
        a: "Yes. We process visas for travelers going to Arab countries.",
      },
      {
        q: "How fast is the COC service?",
        a: "We prepare Certificate of Competence within 24 hours.",
      },
      {
        q: "Where are you based?",
        a: "Call us from anywhere. Idris Tour and Travel — phones listed on this page.",
      },
    ],
    footer: {
      tagline: "Your Journey, Our Priority.",
      details: "Addis Ababa · Passport, visas, flights, hotels, tours and full travel support.",
      disclaimer:
        "Prices and processing times are indicative. Confirm with the desk before payment.",
      back: "Back to the beginning",
    },
    enquire: {
      title: "Send a request",
      name: "Full name",
      phone: "Phone / WhatsApp",
      email: "Email (optional)",
      journey: "Service needed",
      when: "Preferred date",
      travelers: "Number of people",
      note: "Message",
      submit: "Send request",
    },
    admin: {
      title: "Admin dashboard",
      login: "Sign in",
      password: "Admin password",
      save: "Save changes",
      logout: "Log out",
      hint: "Default password: idris2025 (change after first login in production)",
    },
  },
  om: {
    brandName: "Idris Tour",
    brandTag: "And Travel · Finfinnee",
    nav: {
      story: "Seenaa keenya",
      journeys: "Imaltoota",
      services: "Tajaajila imalaa",
      faq: "Beekuu qabdu",
      plan: "Imala qopheessi",
    },
    hero: {
      kicker: "Itoophiyaa irraa gara addunyaatti",
      title: "Imalli keessan, dursaa keenya",
      subtitle:
        "Tajaajila passportii, Umrah, xayyaara biyya alaa, hoteloota, viisaa fi deeggarsa imalaa guutuu — rakkoo tokko malee.",
      cta: "Tajaajila ilaali",
    },
    servicesSection: {
      kicker: "Waan nu biraa argattu",
      title: "Tajaajila kanneen nu biraa ni argattu",
      intro:
        "Namoota biyya alaa deemu barbaadaniif. Passportii baafachuuf nammoonni baayyeen rakkoo addaa addaatiif saaxilamaa akka jiru bekkamaadha. Rakkoo tokko malee isin kessummeessuuf Qophii xumurree jira.",
    },
    services: [
      {
        title: "Tajaajila Passportii",
        detail:
          "Passportii Arifachiisaa (guyyaa lamaa ykn shanii) fi tajaajila normal. Barbaachisan: warqaa dhalootaa, waraqaa eenyummaa, National ID.",
      },
      {
        title: "COC sa'aatii 24 keessatti",
        detail: "Certificate of Competence sa'aatii 24 keessatti isiniif hojjanna.",
      },
      {
        title: "Police clearance",
        detail: "Deeggarsa fi hojii police clearance certificate.",
      },
      {
        title: "Medical appointment",
        detail: "Medical appointmentii imalaaf qopheessuu.",
      },
      {
        title: "ILMS & tikeetii xayyaaraa",
        detail: "ILMS fi tikeetii xayyaaraa gatii madalawaadhaan.",
      },
      {
        title: "Viisaa biyya Arabaa",
        detail: "Namoota biyya Arabaa deemuuf viisaa ni hojjanna.",
      },
    ],
    passport: {
      title: "Gosoota passportii",
      urgent: "Passportii Arifachiisaa (Urgent)",
      urgent2: "Kan guyyaa lamaa",
      urgent5: "Kan guyyaa shanii",
      normal: "Normal service",
      required: "Wantoota barbaachisan",
      docs: ["Warqaa dhalootaa", "Waraqaa eenyummaa", "National ID"],
    },
    extraServices: [
      "COC Sa'aatii 24 Keesatti",
      "Police clearance",
      "Medical appointmentii",
      "ILMS",
      "Tikeeti xayaariif gatii madalawaadhaan",
      "Viisaa biyya Arabaa",
    ],
    contact: {
      callUs: "Bakkuma jirtanii nuuf bilbilaa",
      whatsapp: "WhatsApp",
      phones: ["+251 922 00 53 74", "+251 949 89 21 93"],
      thanks: "Galatoomaa",
    },
    faq: [
      {
        q: "Passportii arifachiisaa ni hojjattu?",
        a: "Eeyyee. Tajaajila guyyaa lamaa fi shanii akkasumas normal ni kennina. Warqaa dhalootaa, waraqaa eenyummaa fi National ID fiduu qabdu.",
      },
      {
        q: "Viisaa biyya Arabaa ni gargaartu?",
        a: "Eeyyee. Namoota biyya Arabaa deemuuf viisaa ni hojjanna.",
      },
      {
        q: "COC hammam dafee?",
        a: "Sa'aatii 24 keessatti isiniif hojjanna.",
      },
      {
        q: "Eessa jirtu?",
        a: "Bakkuma jirtanii nuuf bilbilaa. Idris Tour and Travel — lakkoofsa bilbilaa fuula kana irratti ni argama.",
      },
    ],
    footer: {
      tagline: "Imalli keessan, dursaa keenya.",
      details: "Finfinnee · Passportii, viisaa, xayyaara, hoteloota fi deeggarsa imalaa guutuu.",
      disclaimer:
        "Gatii fi yeroon tilmaama. Kaffaltii dura desk waliin mirkaneessaa.",
      back: "Gara jalqabaatti deebi'i",
    },
    enquire: {
      title: "Gaaffii ergi",
      name: "Maqaa guutuu",
      phone: "Bilbila / WhatsApp",
      email: "Imeelii (filannoo)",
      journey: "Tajaajila barbaadu",
      when: "Guyyaa filatame",
      travelers: "Baay'ina namootaa",
      note: "Ergaa",
      submit: "Gaaffii ergi",
    },
    admin: {
      title: "Dashboard Admin",
      login: "Seeni",
      password: "Jecha iccitii Admin",
      save: "Jijjiirama kuusi",
      logout: "Bahi",
      hint: "Jecha iccitii: idris2025",
    },
  },
  am: {
    brandName: "እድሪስ ቱር",
    brandTag: "እና ትራቬል · አዲስ አበባ",
    nav: {
      story: "ታሪካችን",
      journeys: "ጉዞዎች",
      services: "የጉዞ አገልግሎቶች",
      faq: "ማወቅ ያለብዎት",
      plan: "ጉዞ ያቅዱ",
    },
    hero: {
      kicker: "ከኢትዮጵያ ወደ ዓለም",
      title: "ጉዞዎ ቅድሚያችን ነው",
      subtitle:
        "ፓስፖርት አገልግሎት፣ ዑምራ፣ ዓለም አቀፍ በረራ፣ ሆቴሎች፣ ቪዛ እና ሙሉ የጉዞ ድጋፍ — ያለ ችግር ዝግጁ።",
      cta: "አገልግሎቶችን ይመልከቱ",
    },
    servicesSection: {
      kicker: "የምናቀርበው",
      title: "ከእኛ ጋር የሚገኙ አገልግሎቶች",
      intro:
        "ወደ ውጭ አገር መሄድ ለሚፈልጉ ሰዎች እንረዳለን። ፓስፖርት ለማውጣት ብዙ ሰዎች ልዩ ችግሮች ያጋጥሟቸዋል። ያለ ምንም ችግር እንቀበላችኋለን።",
    },
    services: [
      {
        title: "የፓስፖርት አገልግሎት",
        detail:
          "አስቸኳይ ፓስፖርት (2 ቀን ወይም 5 ቀን) እና መደበኛ አገልግሎት። የሚያስፈልጉ፡ የልደት ሰርተፍኬት፣ መታወቂያ፣ ብሔራዊ መታወቂያ።",
      },
      {
        title: "COC በ24 ሰዓት",
        detail: "Certificate of Competence በ24 ሰዓት ውስጥ እናዘጋጃለን።",
      },
      {
        title: "የፖሊስ ማጽጃ",
        detail: "የፖሊስ ማጽጃ ሰርተፍኬት ድጋፍ እና አሰራር።",
      },
      {
        title: "የሕክምና ቀጠሮ",
        detail: "ለጉዞ መስፈርቶች የሕክምና ቀጠሮ ማስያዝ።",
      },
      {
        title: "ILMS እና የበረራ ትኬት",
        detail: "ILMS ድጋፍ እና በተመጣጣኝ ዋጋ የበረራ ትኬቶች።",
      },
      {
        title: "የዓረብ አገሮች ቪዛ",
        detail: "ወደ ዓረብ አገሮች ለሚሄዱ ሰዎች ቪዛ እናዘጋጃለን።",
      },
    ],
    passport: {
      title: "የፓስፖርት ዓይነቶች",
      urgent: "አስቸኳይ ፓስፖርት",
      urgent2: "የ2 ቀን አገልግሎት",
      urgent5: "የ5 ቀን አገልግሎት",
      normal: "መደበኛ አገልግሎት",
      required: "የሚያስፈልጉ ሰነዶች",
      docs: ["የልደት ሰርተፍኬት", "መታወቂያ / የማንነት ሰነድ", "ብሔራዊ መታወቂያ"],
    },
    extraServices: [
      "COC በ24 ሰዓት",
      "የፖሊስ ማጽጃ",
      "የሕክምና ቀጠሮ",
      "ILMS",
      "የበረራ ትኬት በተመጣጣኝ ዋጋ",
      "የዓረብ አገሮች ቪዛ",
    ],
    contact: {
      callUs: "ከትም ቦታ ይደውሉልን",
      whatsapp: "WhatsApp",
      phones: ["+251 922 00 53 74", "+251 949 89 21 93"],
      thanks: "አመሰግናለሁ",
    },
    faq: [
      {
        q: "አስቸኳይ ፓስፖርት ታደርጋላችሁ?",
        a: "አዎ። የ2 ቀን እና የ5 ቀን አስቸኳይ እንዲሁም መደበኛ አገልግሎት እንሰጣለን። የልደት ሰርተፍኬት፣ መታወቂያ እና ብሔራዊ መታወቂያ ይዘው ይምጡ።",
      },
      {
        q: "የዓረብ አገር ቪዛ ትረዳላችሁ?",
        a: "አዎ። ወደ ዓረብ አገሮች ለሚሄዱ ቪዛ እናዘጋጃለን።",
      },
      {
        q: "COC ምን ያህል ፈጣን ነው?",
        a: "በ24 ሰዓት ውስጥ እናዘጋጃለን።",
      },
      {
        q: "የት ነው የምትገኙት?",
        a: "ከትም ቦታ ይደውሉልን። እድሪስ ቱር እና ትራቬል — ስልክ ቁጥሮች በዚህ ገጽ ላይ አሉ።",
      },
    ],
    footer: {
      tagline: "ጉዞዎ ቅድሚያችን ነው።",
      details: "አዲስ አበባ · ፓስፖርት፣ ቪዛ፣ በረራ፣ ሆቴል እና ሙሉ የጉዞ ድጋፍ።",
      disclaimer: "ዋጋ እና ጊዜ ግምታዊ ናቸው። ከመክፈልዎ በፊት ከዴስኩ ያረጋግጡ።",
      back: "ወደ መጀመሪያ ተመለስ",
    },
    enquire: {
      title: "ጥያቄ ይላኩ",
      name: "ሙሉ ስም",
      phone: "ስልክ / WhatsApp",
      email: "ኢሜይል (አማራጭ)",
      journey: "የሚፈልጉት አገልግሎት",
      when: "የሚመርጡት ቀን",
      travelers: "የሰዎች ቁጥር",
      note: "መልእክት",
      submit: "ጥያቄ ላክ",
    },
    admin: {
      title: "የአስተዳዳሪ ዳሽቦርድ",
      login: "ግባ",
      password: "የአስተዳዳሪ የይለፍ ቃል",
      save: "ለውጦችን አስቀምጥ",
      logout: "ውጣ",
      hint: "ነባሪ የይለፍ ቃል፡ idris2025",
    },
  },
};
