import { useState } from "react";
import { FaCheck, FaUsers } from "react-icons/fa";
import { useAuth } from "../pages/authentication/AuthContext";
import SpecialistIcon from "./SpecialistIcon";

const USD_TO_INR = 95.11;
const SINGLE_AI_PRICE_USD = 19;

const plans = [
  {
    id: "spark",
    name: "Spark",
    tagline: "Your AI workforce begins here",
    price: 35,
    aiCount: "Any 2 AI Employees",
    usage: "Medium usage limits",
    users: 1,
    devices: 1,
    description: "Best for individuals and first-time AI workforce users.",
    features: ["Choose any 2 specialist AI employees", "Personal AI Assistant included", "1 user, 1 device", "Medium usage limits"],
  },
  {
    id: "nexus",
    name: "Nexus",
    tagline: "Your connected AI team",
    price: 65,
    aiCount: "Any 4 AI Employees",
    usage: "Medium usage limits",
    users: 2,
    devices: 2,
    description: "Best for growing businesses that need multiple specialized AI employees.",
    features: ["Choose any 4 specialist AI employees", "Personal AI Assistant included", "2 users, 2 devices", "Medium usage limits"],
  },
  {
    id: "infinity",
    name: "Infinity",
    tagline: "Your AI workforce, expanded",
    price: 250,
    aiCount: "Choose any 6 AI Employees",
    usage: "High usage limits",
    users: 3,
    devices: 3,
    description: "Best for businesses ready to build a broader AI-powered operation.",
    features: ["Choose any 6 specialist AI employees", "Personal AI Assistant included", "3 users, 3 devices", "High usage limits", "Early access to upcoming AI employees through trials"],
  },
];

const pricingTranslations = {
  ta: {
    headingLabel: "தனி நிபுணர் அல்லது முழு AI குழு", heading: "உங்கள் AI பணிக்குழுவை உருவாக்குங்கள்.", intro: "ஒவ்வொரு திட்டத்திலும் கிடைக்கும் AI நிபுணர்களின் எண்ணிக்கை தெளிவாகக் காட்டப்படும். தனிப்பட்ட AI உதவியாளர் எல்லா திட்டங்களிலும் சேர்க்கப்பட்டுள்ளார்.", currency: "நாணயம்", singleLabel: "ஒரு AI ஊழியரை வாங்குங்கள்", singleTitle: "ஒரு நிபுணர். ஒரு சந்தா.", singleDescription: "இந்த வாங்குதல் தேர்ந்தெடுக்கப்பட்ட ஒரு AI நிபுணருக்கான அணுகலை வழங்குகிறது. தனிப்பட்ட உதவியாளர் சேர்க்கப்பட்டுள்ளார்; மற்ற நிபுணர்களைத் தனியாக வாங்கலாம்.", small: "சிறு வணிகம்", corporate: "நிறுவனம்", general: "பொதுப் பயன்பாட்டு AI சந்தா", generalDescription: "பொதுப் பயன்பாட்டிற்கான ஒரு AI சந்தா.", singleAI: "ZENGEN AI தனி நிபுணர்", purchaseText: "தனிப்பட்ட உதவியாளருடன் ஒரு AI நிபுணரைத் தேர்ந்தெடுக்கவும்.", corporateText: "உங்கள் நிறுவனத்திற்கான ஒரு AI நிபுணர். நிறுவனத் தேவைகளுக்கு ஏற்ப விலை நிர்ணயிக்கப்படும்.", custom: "தனிப்பயன்", specialist: "தேர்ந்தெடுத்த ஒரு நிபுணர்", assistant: "தனிப்பட்ட உதவியாளர் சேர்க்கப்பட்டுள்ளது", availability: "Finance Analyst இப்போது கிடைக்கிறது. HR Executive மற்றும் Sales Analyst விரைவில் வரும்.", packages: "தனி பல-நிபுணர் திட்டங்கள்", planTitle: "Zengen AI பணிக்குழுத் திட்டத்தைத் தேர்ந்தெடுக்கவும்.", planDescription: "இவை ஒரு AI வாங்குதலிலிருந்து தனியான சந்தாக்கள். ஒவ்வொரு விலையும் திட்டத்தில் குறிப்பிடப்பட்ட நிபுணர்களை உள்ளடக்கும்; தனிப்பட்ட உதவியாளரும் சேர்க்கப்படுகிறார்.", preview: "திட்ட முன்னோட்டம். நிபுணர் தேர்வும் கட்டணமும் விரைவில்.", month: "/ மாதம்", packageMonth: "/ திட்டம் / மாதம்", pricingNote: "ZengenAI விலைகள் தொடக்க முன்னோட்டம். INR தொகைகள் தோராயமான மாற்று மதிப்புகள்; உள்ளூர் கட்டணம் மாறலாம். திட்டங்கள் தொடங்குவதற்கு முன் விவரங்கள் உறுதி செய்யப்படும்.", popular: "பிரபலமானது", planTagline: ["உங்கள் AI பணிக்குழுவின் தொடக்கம்", "இணைந்த AI குழு", "விரிவான AI பணிக்குழு"], planCount: ["எந்த 2 AI ஊழியர்களும்", "எந்த 4 AI ஊழியர்களும்", "எந்த 6 AI ஊழியர்களையும் தேர்வு செய்யுங்கள்"], planDescriptionCard: ["தனிநபர்கள் மற்றும் முதல் முறை AI பணிக்குழு பயனர்களுக்கு ஏற்றது.", "பல AI நிபுணர்கள் தேவைப்படும் வளர்ந்து வரும் வணிகங்களுக்கு ஏற்றது.", "விரிவான AI செயல்பாட்டை உருவாக்கும் வணிகங்களுக்கு ஏற்றது."],
  },
  hi: {
    headingLabel: "एक विशेषज्ञ या पूरी AI टीम", heading: "अपना AI कार्यबल बनाएँ।", intro: "हर योजना में मिलने वाले विशेषज्ञ AI कर्मचारियों की संख्या साफ़ दिखाई गई है। निजी AI सहायक हर योजना में शामिल है।", currency: "मुद्रा", singleLabel: "एक AI कर्मचारी खरीदें", singleTitle: "एक विशेषज्ञ। एक सदस्यता।", singleDescription: "इस खरीद से चुने हुए एक AI विशेषज्ञ का उपयोग मिलेगा। निजी सहायक शामिल है; अन्य विशेषज्ञ अलग से खरीदे जा सकते हैं।", small: "छोटा व्यवसाय", corporate: "कॉर्पोरेट", general: "सामान्य AI सदस्यता", generalDescription: "एक सामान्य उपयोग वाली AI सदस्यता।", singleAI: "ZENGEN AI एकल विशेषज्ञ", purchaseText: "निजी सहायक के साथ एक AI विशेषज्ञ चुनें।", corporateText: "आपके संगठन के लिए एक विशेषज्ञ AI। कॉर्पोरेट कीमत आपकी ज़रूरत के अनुसार होगी।", custom: "कस्टम", specialist: "एक चुना हुआ विशेषज्ञ", assistant: "निजी सहायक शामिल", availability: "Finance Analyst अभी उपलब्ध है। HR Executive और Sales Analyst जल्द आ रहे हैं।", packages: "अलग बहु-विशेषज्ञ योजनाएँ", planTitle: "Zengen AI कार्यबल योजना चुनें।", planDescription: "ये एक AI खरीदने से अलग सदस्यताएँ हैं। हर कीमत में सूचीबद्ध AI विशेषज्ञ शामिल हैं; निजी सहायक भी शामिल है।", preview: "योजना का पूर्वावलोकन। विशेषज्ञ चयन और भुगतान जल्द उपलब्ध होंगे।", month: "/ महीना", packageMonth: "/ पैकेज / महीना", pricingNote: "ZengenAI की कीमतें शुरुआती पूर्वावलोकन हैं। INR राशि अनुमानित रूपांतरण है; स्थानीय बिलिंग बदल सकती है। योजनाएँ शुरू होने से पहले विवरण पक्के होंगे।", popular: "लोकप्रिय", planTagline: ["आपका AI कार्यबल यहीं से शुरू", "आपकी जुड़ी हुई AI टीम", "विस्तृत AI कार्यबल"], planCount: ["कोई भी 2 AI कर्मचारी", "कोई भी 4 AI कर्मचारी", "कोई भी 6 AI कर्मचारी चुनें"], planDescriptionCard: ["व्यक्तियों और पहली बार AI कार्यबल इस्तेमाल करने वालों के लिए।", "कई विशेषज्ञ AI कर्मचारियों की ज़रूरत वाले बढ़ते व्यवसायों के लिए।", "व्यापक AI संचालन बनाने के लिए तैयार व्यवसायों के लिए।"],
  },
  es: {
    headingLabel: "Un especialista o todo un equipo de IA", heading: "Crea tu equipo de IA.", intro: "Cada plan indica claramente cuántos especialistas de IA incluye. El Asistente Personal está incluido en todos los planes.", currency: "Moneda", singleLabel: "Compra un empleado de IA", singleTitle: "Un especialista. Una suscripción.", singleDescription: "Esta compra da acceso a un especialista de IA seleccionado. El Asistente Personal está incluido; los demás especialistas se compran por separado.", small: "Pequeña empresa", corporate: "Empresa", general: "Suscripción de IA general", generalDescription: "Una suscripción de IA de propósito general.", singleAI: "ZENGEN AI ESPECIALISTA INDIVIDUAL", purchaseText: "Elige un especialista de IA con tu Asistente Personal incluido.", corporateText: "Un especialista de IA para tu organización. Precio empresarial adaptado a tus necesidades.", custom: "Personalizado", specialist: "Un especialista elegido", assistant: "Asistente Personal incluido", availability: "Analista financiero disponible. Ejecutivo de RR. HH. y Analista de ventas próximamente.", packages: "Planes separados con varios especialistas", planTitle: "Elige un plan de equipo de IA Zengen.", planDescription: "Son suscripciones distintas a la compra de un solo AI. Cada precio cubre los especialistas indicados; el Asistente Personal también está incluido.", preview: "Vista previa del plan. La selección de especialistas y el pago estarán disponibles próximamente.", month: "/ mes", packageMonth: "/ paquete / mes", pricingNote: "Los precios de ZengenAI son una vista previa de lanzamiento. Los importes en INR son conversiones aproximadas; la facturación local puede variar. Confirmaremos los detalles antes del lanzamiento.", popular: "POPULAR", planTagline: ["Aquí empieza tu equipo de IA", "Tu equipo de IA conectado", "Un equipo de IA ampliado"], planCount: ["Cualquier 2 empleados de IA", "Cualquier 4 empleados de IA", "Elige hasta 6 empleados de IA"], planDescriptionCard: ["Ideal para particulares y quienes empiezan con un equipo de IA.", "Ideal para empresas en crecimiento que necesitan varios especialistas.", "Para empresas que quieren ampliar sus operaciones con IA."],
  },
};

const planFeatureTranslations = {
  ta: [
    ["விருப்பமான 2 AI நிபுணர்களைத் தேர்ந்தெடுக்கவும்", "தனிப்பட்ட AI உதவியாளர் சேர்க்கப்பட்டுள்ளார்", "1 பயனர் · 1 சாதனம்", "மிதமான பயன்பாட்டு வரம்பு"],
    ["விருப்பமான 4 AI நிபுணர்களைத் தேர்ந்தெடுக்கவும்", "தனிப்பட்ட AI உதவியாளர் சேர்க்கப்பட்டுள்ளார்", "2 பயனர்கள் · 2 சாதனங்கள்", "மிதமான பயன்பாட்டு வரம்பு"],
    ["விருப்பமான 6 AI நிபுணர்களைத் தேர்ந்தெடுக்கவும்", "தனிப்பட்ட AI உதவியாளர் சேர்க்கப்பட்டுள்ளார்", "3 பயனர்கள் · 3 சாதனங்கள்", "அதிகமான பயன்பாட்டு வரம்பு", "புதிய AI நிபுணர்களை முன்கூட்டியே பயன்படுத்தலாம்"],
  ],
  hi: [
    ["कोई भी 2 विशेषज्ञ AI कर्मचारी चुनें", "निजी AI सहायक शामिल", "1 उपयोगकर्ता, 1 डिवाइस", "मध्यम उपयोग सीमा"],
    ["कोई भी 4 विशेषज्ञ AI कर्मचारी चुनें", "निजी AI सहायक शामिल", "2 उपयोगकर्ता, 2 डिवाइस", "मध्यम उपयोग सीमा"],
    ["कोई भी 6 विशेषज्ञ AI कर्मचारी चुनें", "निजी AI सहायक शामिल", "3 उपयोगकर्ता, 3 डिवाइस", "उच्च उपयोग सीमा", "आने वाले AI कर्मचारियों का शुरुआती उपयोग"],
  ],
  es: [
    ["Elige 2 especialistas de IA", "Asistente Personal incluido", "1 usuario, 1 dispositivo", "Límites de uso medios"],
    ["Elige 4 especialistas de IA", "Asistente Personal incluido", "2 usuarios, 2 dispositivos", "Límites de uso medios"],
    ["Elige 6 especialistas de IA", "Asistente Personal incluido", "3 usuarios, 3 dispositivos", "Límites de uso altos", "Acceso anticipado a próximos especialistas"],
  ],
};

const tamilPricing = {
  headingLabel: "ஒரு AI நிபுணரா, முழு AI குழுவா?",
  heading: "உங்கள் தேவைக்கேற்ற AI திட்டத்தைத் தேர்ந்தெடுங்கள்.",
  intro: "ஒவ்வொரு திட்டத்திலும் கிடைக்கும் AI நிபுணர்களின் எண்ணிக்கை தெளிவாகக் கொடுக்கப்பட்டுள்ளது. எல்லா திட்டங்களிலும் தனிப்பட்ட AI உதவியாளர் சேர்க்கப்பட்டுள்ளார்.",
  currency: "நாணயத்தைத் தேர்ந்தெடுக்கவும்",
  singleLabel: "ஒரு AI நிபுணரை மட்டும் வாங்குங்கள்",
  singleTitle: "ஒரு நிபுணர். ஒரு சந்தா.",
  singleDescription: "நீங்கள் தேர்ந்தெடுக்கும் ஒரு AI நிபுணரைப் பயன்படுத்தலாம். தனிப்பட்ட உதவியாளர் திட்டத்தில் சேர்க்கப்பட்டுள்ளார்; மற்ற AI நிபுணர்களைத் தனியாக வாங்கலாம்.",
  small: "சிறு வணிகம்",
  corporate: "பெருநிறுவனம்",
  general: "பொதுப் பயன்பாட்டு AI சந்தா",
  generalDescription: "பொதுவான பயன்பாடுகளுக்கான AI சந்தா.",
  singleAI: "ZENGEN AI நிபுணர் திட்டம்",
  purchaseText: "ஒரு AI நிபுணரைத் தேர்ந்தெடுங்கள்; தனிப்பட்ட உதவியாளர் இலவசமாகச் சேர்க்கப்படுகிறார்.",
  corporateText: "உங்கள் நிறுவனத்திற்கான ஒரு AI நிபுணர். நிறுவனத் தேவைக்கேற்ப விலை நிர்ணயிக்கப்படும்.",
  custom: "தனிப்பயன் விலை",
  specialist: "நீங்கள் தேர்ந்தெடுக்கும் ஒரு நிபுணர்",
  assistant: "தனிப்பட்ட உதவியாளர் சேர்க்கப்பட்டுள்ளார்",
  purchased: "நிதி ஆய்வாளர் அணுகல் உள்ளது",
  availability: "நிதி ஆய்வாளர் இப்போது கிடைக்கிறார். மனிதவள நிர்வாகியும் விற்பனை ஆய்வாளரும் விரைவில் அறிமுகமாகிறார்கள்.",
  packages: "பல AI நிபுணர்களைக் கொண்ட திட்டங்கள்",
  planTitle: "உங்கள் AI குழுவுக்கான திட்டத்தைத் தேர்ந்தெடுங்கள்.",
  planDescription: "ஒரு நிபுணரை மட்டும் வாங்குவதிலிருந்து இவை வேறுபட்ட சந்தாக்கள். ஒவ்வொரு திட்டத்திலும் குறிப்பிட்ட எண்ணிக்கையிலான AI நிபுணர்களும் தனிப்பட்ட உதவியாளரும் கிடைப்பார்கள்.",
  preview: "திட்டத்தின் முன்னோட்டம். AI நிபுணர் தேர்வும் கட்டண வசதியும் விரைவில்.",
  month: "/ மாதம்",
  packageMonth: "/ திட்டம் / மாதம்",
  pricingNote: "ZengenAI திட்ட விலைகள் தொடக்க முன்னோட்டம் மட்டுமே. INR தொகைகள் தோராயமான மாற்றுக் கணக்கீடு; உள்ளூர் கட்டணம் மாறலாம்.",
  popular: "பிரபலமானது",
  planTagline: ["AI குழுவைத் தொடங்குங்கள்", "இணைந்த AI குழு", "மேலும் AI நிபுணர்களுடன் வளருங்கள்"],
  planCount: ["விருப்பமான 2 AI நிபுணர்கள்", "விருப்பமான 4 AI நிபுணர்கள்", "விருப்பமான 6 AI நிபுணர்களைத் தேர்ந்தெடுங்கள்"],
  planDescriptionCard: ["தனிநபர்களுக்கும் AI உதவியை முதன்முறையாகப் பயன்படுத்துவோருக்கும் ஏற்றது.", "பல நிபுணர்கள் தேவைப்படும் வளர்ந்து வரும் வணிகங்களுக்கு ஏற்றது.", "விரிவான AI பணிக்குழுவை உருவாக்க விரும்பும் வணிகங்களுக்கு ஏற்றது."],
};

function applyTamilTypeface(value) {
  if (typeof value === "string") {
    return value.split(/([\u0b80-\u0bff]+)/u).map((part, index) => (
      /^[\u0b80-\u0bff]+$/u.test(part)
        ? <span className="tamil-script" key={`${part}-${index}`} lang="ta">{part}</span>
        : part
    ));
  }
  if (Array.isArray(value)) return value.map(applyTamilTypeface);
  return value;
}

function money(usd, currency, language = "en") {
  const amount = currency === "INR" ? usd * USD_TO_INR : usd;
  const locale = { en: currency === "INR" ? "en-IN" : "en-US", ta: "ta-IN", hi: "hi-IN", es: "es-ES" }[language] || "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(amount);
}

function Toggle({ value, onChange, options, label }) {
  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-[#111018] p-1" aria-label={label}>
      {options.map((option) => (
        <button
          aria-pressed={value === option.value}
          className={`rounded-lg px-3 py-2 text-[10px] font-semibold transition ${value === option.value ? "bg-violet-300 text-[#171222]" : "text-[#aaa4b8] hover:text-white"}`}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap" aria-label="ZengenAI">
      <span className="text-[32px] leading-none tracking-[0.04em] text-white sm:text-[36px]" style={{ fontFamily: "'Great Vibes', cursive" }}>
        Zengen
      </span>
      <span className="rounded-md border border-violet-300/25 bg-violet-300/[0.08] px-2 py-1 font-display text-[10px] font-bold tracking-[0.18em] text-violet-200">
        AI
      </span>
    </span>
  );
}

function PlanCard({ plan, currency, language }) {
  const translation = language === "ta" ? applyTamilTypeface(tamilPricing) : pricingTranslations[language];
  const planIndex = plans.findIndex(({ id }) => id === plan.id);
  return (
    <article className={`relative flex h-full flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${plan.id === "nexus" ? "border-violet-200/30 bg-gradient-to-b from-[#211b31] to-[#14121a] shadow-[0_20px_65px_rgba(106,80,160,0.12)]" : "border-white/[0.08] bg-[#111018]/85 hover:border-violet-200/20"}`}>
      {plan.id === "nexus" && <span className="absolute right-4 top-4 rounded-full border border-violet-200/15 bg-violet-300/10 px-2.5 py-1 text-[8px] font-semibold text-violet-200">{translation?.popular || "POPULAR"}</span>}
        <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-violet-200/10 bg-violet-300/10 text-violet-200">
          <FaUsers />
        </span>
        <div>
          <p className="mb-1 text-[8px] font-bold tracking-[0.16em] text-violet-200">ZENGEN AI WORKFORCE</p>
          <h3 className="m-0 block min-h-[52px] pt-1 text-[40px] leading-[1.2] text-white" style={{ fontFamily: "'Great Vibes', cursive" }}>{plan.name}</h3>
        </div>
      </div>
      <p className="mb-4 text-[10px] font-medium text-[#d5cdea]">{translation?.planTagline[planIndex] || plan.tagline}</p>

      <div className="mb-4 flex items-end gap-1.5">
        <strong className="font-display text-3xl font-semibold tracking-tight text-white">{money(plan.price, currency, language)}</strong>
        <span className="pb-1 text-[10px] text-[#898497]">{translation?.packageMonth || "/ package / month"}</span>
      </div>
      <p className="mb-1 text-[11px] font-semibold text-white">{translation?.planCount[planIndex] || plan.aiCount}</p>
      <p className="mb-4 min-h-[34px] text-[9px] leading-relaxed text-[#9995a8]">{translation?.planDescriptionCard[planIndex] || plan.description}</p>

      <ul className="mb-5 mt-0 grid list-none gap-3 border-t border-white/[0.07] pt-4 pl-0">
        {plan.features.map((feature, index) => (
          <li className="flex items-start gap-2.5 text-[9px] leading-relaxed text-[#c6c1d1]" key={feature}>
            {index === 1 ? <SpecialistIcon type="assistant" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-200" /> : <FaCheck className="mt-0.5 shrink-0 text-emerald-300" />}
            <span>{language === "ta" ? applyTamilTypeface(planFeatureTranslations.ta[planIndex][index]) : (planFeatureTranslations[language]?.[planIndex]?.[index] || feature)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto rounded-xl border border-white/[0.06] bg-black/15 px-3 py-2.5 text-[9px] leading-relaxed text-[#aaa4b8]">
        {translation?.preview || "Plan preview. Specialist selection and checkout are coming soon."}
      </div>
    </article>
  );
}

export default function PricingPlans({ compact = false, language = "en" }) {
  const { user } = useAuth();
  const [currency, setCurrency] = useState("USD");
  const [singleBuyerType, setSingleBuyerType] = useState("small");
  const translation = language === "ta" ? applyTamilTypeface(tamilPricing) : pricingTranslations[language];
  const wrapper = compact ? "px-5 py-8 sm:px-8" : "mx-auto w-full max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24";

  return (
    <section className={wrapper} id={compact ? undefined : "pricing"}>
      <div className="relative overflow-hidden rounded-[28px] border border-violet-200/15 bg-[radial-gradient(ellipse_at_88%_0%,rgba(143,123,221,0.13),transparent_38%),linear-gradient(145deg,#17141f,#111018_65%,#17131e)] p-5 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-28 -top-36 h-80 w-80 rounded-full border border-violet-200/[0.08]" />
        <div className="relative">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="mb-3 text-[9px] font-bold tracking-[0.2em] text-violet-300">{translation?.headingLabel || "SINGLE SPECIALIST OR FULL AI TEAM"}</p>
              <h2 className="m-0 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">{translation?.heading || "Choose how to build your AI workforce."}</h2>
              <p className="mb-0 mt-3 max-w-2xl text-xs leading-6 text-[#aaa4b8]">
                {translation?.intro || "Every plan clearly shows how many specialist AI employees you get. Your Personal AI Assistant is included in every plan."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Toggle
                label={translation?.currency || "Display currency"}
                value={currency}
                onChange={setCurrency}
                options={[{ value: "USD", label: "USD" }, { value: "INR", label: "INR" }]}
              />
            </div>
          </div>

          <div className="mb-10 rounded-2xl border border-white/[0.08] bg-[#111018]/60 p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[8px] font-bold tracking-[0.16em] text-violet-200">{translation?.singleLabel || "BUY A SINGLE AI EMPLOYEE"}</p>
                <h3 className="mb-1 font-display text-xl font-semibold text-white">{translation?.singleTitle || "One specialist. One subscription."}</h3>
                <p className="mb-0 max-w-2xl text-[10px] leading-relaxed text-[#9995a8]">{translation?.singleDescription || "This purchase gives access to one selected specialist AI. The Personal Assistant is included; other specialists are separate purchases."}</p>
              </div>
              <Toggle
                label="Single specialist customer type"
                value={singleBuyerType}
                onChange={setSingleBuyerType}
                options={[{ value: "small", label: translation?.small || "Small business" }, { value: "corporate", label: translation?.corporate || "Corporate" }]}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-[#111018]/75 p-5">
              <p className="mb-2 text-[8px] font-bold tracking-[0.16em] text-[#898497]">{translation?.general || "GENERAL AI SUBSCRIPTION"}</p>
              <h3 className="mb-1 font-display text-lg font-semibold text-white">ChatGPT Plus</h3>
              <p className="mb-3 text-[9px] text-[#9995a8]">{translation?.generalDescription || "One general-purpose AI subscription."}</p>
              <strong className="font-display text-2xl text-white">{money(20, currency, language)}</strong>
              <span className="ml-1 text-[9px] text-[#898497]">{translation?.month || "/ month"}</span>
              </div>
              <div className="rounded-2xl border border-violet-200/20 bg-gradient-to-br from-[#211b31] to-[#14121a] p-5">
              <p className="mb-2 text-[8px] font-bold tracking-[0.16em] text-violet-200">{translation?.singleAI || "ZENGEN AI SINGLE SPECIALIST"}</p>
              <Wordmark />
              <p className="mb-3 mt-2 text-[9px] leading-relaxed text-[#c6c1d1]">{singleBuyerType === "small" ? (translation?.purchaseText || "Choose one specialist AI, with your Personal Assistant included.") : (translation?.corporateText || "One specialist AI for your organization. Corporate pricing is tailored to your requirements.")}</p>
              <strong className="font-display text-2xl text-white">{singleBuyerType === "small" ? money(SINGLE_AI_PRICE_USD, currency, language) : (translation?.custom || "Custom")}</strong>
              {singleBuyerType === "small" && <span className="ml-1 text-[9px] text-[#aaa4b8]">/ AI / {translation?.month || "month"}</span>}
              <div className="flex pt-3 flex-wrap gap-2 text-[8px] text-[#ded7f0]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/15 px-2.5 py-1.5"><FaCheck className="text-emerald-300" /> {translation?.specialist || "One selected specialist"}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/15 px-2.5 py-1.5"><FaCheck className="text-emerald-300" /> {translation?.assistant || "Personal Assistant included"}</span>
                {user && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-2.5 py-1.5 text-emerald-200"><SpecialistIcon type="finance" className="h-3 w-3" /> {language === "ta" ? applyTamilTypeface(tamilPricing.purchased) : "Finance Analyst purchased"}</span>}
              </div>
              </div>
            </div>
          </div>

          <p className="mb-4 text-[9px] leading-relaxed text-[#9995a8]">
            {translation?.availability || "Finance Analyst is available now. HR Executive and Sales Analyst are coming soon; plan selections apply as each specialist launches."}
          </p>

          <div className="mb-5 border-t border-white/[0.07] pt-8">
            <p className="mb-2 text-[8px] font-bold tracking-[0.16em] text-violet-200">{translation?.packages || "SEPARATE MULTI-SPECIALIST PACKAGES"}</p>
            <h3 className="mb-2 font-display text-2xl font-semibold text-white">{translation?.planTitle || "Choose a Zengen AI workforce plan."}</h3>
            <p className="mb-0 max-w-2xl text-[10px] leading-relaxed text-[#9995a8]">{translation?.planDescription || "These are separate subscriptions from buying one AI. Each price covers the full package and the listed number of specialist AI employees; the Personal Assistant is included separately."}</p>
          </div>

          <div className="grid items-stretch gap-3 md:grid-cols-3">
            {plans.map((plan) => <PlanCard key={plan.id} plan={plan} currency={currency} language={language} />)}
          </div>
          <p className="mb-0 mt-4 text-[8px] leading-relaxed text-[#777285]">
            {translation?.pricingNote || <>ZengenAI prices are a launch preview. INR amounts are approximate conversions at {USD_TO_INR} INR per USD; local billing may vary. Specialist selections, usage limits, and checkout will be confirmed before plans launch.</>}
          </p>
        </div>
      </div>
    </section>
  );
}
