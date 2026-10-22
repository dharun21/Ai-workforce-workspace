import { Link } from "react-router-dom";
import { useState } from "react";
import { FaArrowRight, FaCheck, FaMobileAlt } from "react-icons/fa";
import { useAuth } from "./authentication/AuthContext";
import SpecialistIcon from "../components/SpecialistIcon";
import PricingPlans from "../components/PricingPlans";

const specialists = [
  {
    type: "finance",
    name: "Finance Analyst",
    description: "Go beyond invoices: talk through business goals, understand cash flow, and find practical ways to grow.",
    status: "Available now",
    tone: "bg-violet-300/10 text-violet-200",
  },
  {
    type: "assistant",
    name: "Personal Assistant",
    description: "Chat through your thoughts, ask for help, make plans, and keep reminders and everyday life in one place.",
    status: "Included with Purchase",
    tone: "bg-pink-300/10 text-pink-200",
  },
  {
    type: "hr",
    name: "HR Executive",
    description: "Support people operations, onboarding, and routine team requests.",
    status: "Coming soon",
    tone: "bg-sky-300/10 text-sky-200",
  },
  {
    type: "sales",
    name: "Sales Analyst",
    description: "Explore market signals and growth opportunities, then find practical ways to help your business stand out.",
    status: "Coming soon",
    tone: "bg-emerald-300/10 text-emerald-200",
  },
];

const landingCopy = {
  en: {
    nav: ["AI team", "Pricing", "How it works", "Mobile apps"], signIn: "Sign in", login: "Log in", open: "Open workspace", openYour: "Open your workspace", start: "Get started", meet: "Meet your AI team",
    eyebrow: "A MORE HUMAN WAY TO WORK", hero1: "Your AI team,", hero2: "here for the work", hero3: "and life around it.", intro: "Choose the AI specialists that fit your work, from business growth and finance to sales and people operations. Every AI purchase also includes your all-in-one Personal Assistant for conversations, plans, reminders, and everyday help.",
    benefits: ["Specialist AI for the work you need", "Personal Assistant free with any AI purchase"], sectionEyebrow: "MEET YOUR SPECIALISTS", sectionTitle: "The right help for the work in front of you.", sectionDescription: "One workspace for your business and everyday needs, with more AI teammates on the way.",
    howLabel: "SIMPLE BY DESIGN", howTitle: "A little more room for your best work.", howDescription: "Give each kind of work a specialist, keep everything easy to find, and bring your attention back to what matters most.", steps: [["Choose your teammate", "Open a specialist for the kind of help you need."], ["Bring work into one place", "Keep finance tasks and everyday plans close at hand."], ["Make space for people", "Let a little support take the busywork off your mind."]],
    roadmap: "ON THE ROADMAP", mobileTitle: "Your AI team, wherever your day takes you.", mobileDescription: "Dedicated iOS and Android apps are on our roadmap, so your ZengenAI workspace can travel with you in the future.", planned: "Planned", footer: "Thoughtfully built for better work", workspace: "Workspace", signInFooter: "Sign in",
    specialistNames: ["Finance Analyst", "Personal Assistant", "HR Executive", "Sales Analyst"], specialistDescriptions: ["Go beyond invoices: talk through business goals, understand cash flow, and find practical ways to grow.", "Chat through your thoughts, ask for help, make plans, and keep reminders and everyday life in one place.", "Support people operations, onboarding, and routine team requests.", "Explore market signals and growth opportunities, then find practical ways to help your business stand out."], specialistStatuses: ["Available now", "Included with Purchase", "Coming soon", "Coming soon"],
    preview: ["Workspace", "My AI team", "YOUR WORKSPACE", "A clearer day starts here.", "AI teammates", "Finance workspace", "Personal assistant", "Your AI teammates", "Ready to help", "Today, at a glance", "A little more room for focused work", "Personal Assistant included", "workspace preview"],
  },
  ta: {
    nav: ["AI குழு", "திட்டங்கள்", "எப்படி செயல்படுகிறது", "மொபைல் செயலி"], signIn: "உள்நுழைக", login: "உள்நுழைக", open: "பணியிடத்தைத் திறக்கவும்", openYour: "உங்கள் பணியிடத்தைத் திறக்கவும்", start: "இப்போதே தொடங்குங்கள்", meet: "AI நிபுணர்களைப் பாருங்கள்",
    eyebrow: "உங்கள் வேலைக்கும் வாழ்க்கைக்கும் AI உதவி", hero1: "உங்கள் AI குழு,", hero2: "வேலைக்கும்", hero3: "வாழ்க்கைக்கும் உங்களுடன்.", intro: "வணிகத்தை வளர்க்கவும், நிதியை நிர்வகிக்கவும், விற்பனையை மேம்படுத்தவும் அல்லது பணியாளர் பணிகளைக் கவனிக்கவும் உதவும் AI நிபுணரைத் தேர்ந்தெடுங்கள். AI நிபுணர் திட்டத்துடன், உரையாடல், திட்டமிடல், நினைவூட்டல் மற்றும் அன்றாட உதவிக்கான தனிப்பட்ட உதவியாளரும் இலவசமாகக் கிடைப்பார்.",
    benefits: ["உங்கள் தேவைக்கேற்ற AI நிபுணர்", "AI திட்டத்துடன் தனிப்பட்ட உதவியாளரும் இலவசம்"], sectionEyebrow: "உங்களுக்காக உருவாக்கப்பட்ட நிபுணர்கள்", sectionTitle: "உங்கள் வேலைக்கு ஏற்ற AI நிபுணர்கள்.", sectionDescription: "வணிகப் பணிகளையும் அன்றாடத் தேவைகளையும் ஒரே இடத்தில் கவனியுங்கள். புதிய AI நிபுணர்கள் விரைவில்.",
    howLabel: "உங்கள் வேலைகளை எளிமையாக்குங்கள்", howTitle: "முக்கியமானவற்றுக்கு நேரம் ஒதுக்குங்கள்.", howDescription: "ஒவ்வொரு தேவைக்கும் ஏற்ற AI நிபுணரைத் தேர்ந்தெடுங்கள். வேலைகளையும் திட்டங்களையும் ஒரே இடத்தில் வைத்துக்கொண்டு, முக்கியமானவற்றில் கவனம் செலுத்துங்கள்.", steps: [["உங்களுக்கான நிபுணரைத் தேர்ந்தெடுங்கள்", "உங்களுக்குத் தேவையான பணிக்கு ஏற்ற AI நிபுணரைத் தேர்ந்தெடுங்கள்."], ["எல்லாவற்றையும் ஒரே இடத்தில் வையுங்கள்", "நிதிப் பணிகளையும் அன்றாடத் திட்டங்களையும் எளிதாகப் பார்த்துக்கொள்ளுங்கள்."], ["உங்கள் நேரத்தை மிச்சப்படுத்துங்கள்", "வழக்கமான பணிகளுக்கு உதவி பெற்று, முக்கியமானவற்றில் கவனம் செலுத்துங்கள்."]],
    roadmap: "எதிர்காலத் திட்டத்தில்", mobileTitle: "உங்கள் AI குழு, பயணத்திலும் உங்களுடன்.", mobileDescription: "உங்கள் ZengenAI பணியிடத்தை மொபைலிலும் பயன்படுத்த iOS மற்றும் Android செயலிகள் எங்கள் திட்டத்தில் உள்ளன.", planned: "திட்டமிடப்பட்டுள்ளது", footer: "உங்கள் வேலையைச் சிறப்பாக்க அக்கறையுடன் உருவாக்கப்பட்டது", workspace: "பணியிடம்", signInFooter: "உள்நுழைக",
    specialistNames: ["நிதி ஆய்வாளர்", "தனிப்பட்ட உதவியாளர்", "மனிதவள நிர்வாகி", "விற்பனை ஆய்வாளர்"], specialistDescriptions: ["விலைப்பட்டியல்களை ஒழுங்குபடுத்தி, பணப்புழக்கத்தைப் புரிந்துகொண்டு, வணிக வளர்ச்சி வழிகளைக் கண்டறியுங்கள்.", "யோசனைகளைப் பகிருங்கள், திட்டமிடுங்கள், நினைவூட்டல்களை அமைத்துக்கொள்ளுங்கள்; அன்றாட வேலைகளுக்கும் உதவி பெறுங்கள்.", "பணியாளர் நிர்வாகம், புதியவர்களைப் பணியில் இணைத்தல், குழுவின் அன்றாடத் தேவைகள் ஆகியவற்றுக்கு உதவி.", "சந்தை வாய்ப்புகளைக் கண்டறிந்து, விற்பனையை வளர்க்கும் வழிகளைப் பாருங்கள்."], specialistStatuses: ["இப்போது கிடைக்கிறது", "AI திட்டத்துடன் சேர்க்கப்பட்டுள்ளது", "விரைவில்", "விரைவில்"],
    preview: ["பணியிடம்", "என் AI குழு", "உங்கள் பணியிடம்", "இன்றைய நாள் இங்கே தொடங்குகிறது", "AI நிபுணர்கள்", "நிதிப் பணிகள்", "தனிப்பட்ட உதவியாளர்", "உங்கள் AI குழு", "உதவத் தயார்", "இன்றைய நிலவரம்", "கவனமாக வேலை செய்யுங்கள்", "உதவியாளர் இலவசம்", "பணியிட முன்னோட்டம்"],
  },
  hi: {
    nav: ["AI टीम", "कीमत", "यह कैसे काम करता है", "मोबाइल ऐप"], signIn: "साइन इन", login: "लॉग इन", open: "वर्कस्पेस खोलें", openYour: "अपना वर्कस्पेस खोलें", start: "शुरू करें", meet: "अपनी AI टीम से मिलें",
    eyebrow: "काम करने का अधिक मानवीय तरीका", hero1: "आपकी AI टीम,", hero2: "काम में आपके साथ", hero3: "और जीवन में भी।", intro: "व्यापार वृद्धि, वित्त, बिक्री और लोगों के संचालन के लिए अपने काम के अनुसार AI विशेषज्ञ चुनें। हर AI खरीद में बातचीत, योजनाओं, रिमाइंडर और रोज़मर्रा की मदद के लिए आपका निजी सहायक भी शामिल है।",
    benefits: ["आपके काम के लिए विशेषज्ञ AI", "किसी भी AI खरीद के साथ निजी सहायक मुफ़्त"], sectionEyebrow: "अपने विशेषज्ञों से मिलें", sectionTitle: "आपके काम के लिए सही मदद।", sectionDescription: "व्यापार और रोज़मर्रा की ज़रूरतों के लिए एक वर्कस्पेस; और AI साथी जल्द आ रहे हैं।",
    howLabel: "सरलता से बनाया गया", howTitle: "बेहतर काम के लिए थोड़ी और जगह।", howDescription: "हर तरह के काम के लिए विशेषज्ञ चुनें, सब कुछ आसानी से ढूँढें और ज़रूरी बातों पर ध्यान दें।", steps: [["अपना साथी चुनें", "ज़रूरत के अनुसार विशेषज्ञ खोलें।"], ["काम को एक जगह लाएँ", "वित्तीय काम और रोज़मर्रा की योजनाएँ पास रखें।"], ["लोगों के लिए समय बनाएँ", "छोटी-मोटी व्यस्तताओं में मदद लें।"]],
    roadmap: "आने वाली योजना", mobileTitle: "आपकी AI टीम, दिन के हर पड़ाव पर।", mobileDescription: "iOS और Android ऐप हमारी योजना में हैं, ताकि भविष्य में आपका ZengenAI वर्कस्पेस आपके साथ कहीं भी जा सके।", planned: "नियोजित", footer: "बेहतर काम के लिए सोच-समझकर बनाया गया", workspace: "वर्कस्पेस", signInFooter: "साइन इन",
    specialistNames: ["वित्त विश्लेषक", "निजी सहायक", "HR कार्यकारी", "बिक्री विश्लेषक"], specialistDescriptions: ["इनवॉइस से आगे बढ़ें: व्यापार के लक्ष्य, नकदी प्रवाह और विकास के व्यावहारिक तरीके समझें।", "बातचीत करें, मदद माँगें, योजनाएँ बनाएँ और रिमाइंडर व रोज़मर्रा की बातें एक जगह रखें।", "लोगों के संचालन, ऑनबोर्डिंग और रोज़मर्रा की टीम ज़रूरतों में सहायता।", "बाज़ार के संकेत और विकास के अवसर खोजें, और अपने व्यवसाय को अलग दिखाने के उपाय पाएँ।"], specialistStatuses: ["अभी उपलब्ध", "खरीद के साथ शामिल", "जल्द आ रहा है", "जल्द आ रहा है"],
    preview: ["वर्कस्पेस", "मेरी AI टीम", "आपका वर्कस्पेस", "एक बेहतर दिन यहीं से शुरू होता है।", "AI साथी", "वित्त वर्कस्पेस", "निजी सहायक", "आपके AI साथी", "मदद के लिए तैयार", "आज एक नज़र में", "ध्यान से काम करने के लिए थोड़ी और जगह", "निजी सहायक शामिल", "वर्कस्पेस पूर्वावलोकन"],
  },
  es: {
    nav: ["Equipo de IA", "Precios", "Cómo funciona", "Apps móviles"], signIn: "Iniciar sesión", login: "Acceder", open: "Abrir espacio", openYour: "Abre tu espacio", start: "Comenzar", meet: "Conoce a tu equipo de IA",
    eyebrow: "Una forma más humana de trabajar", hero1: "Tu equipo de IA,", hero2: "aquí para tu trabajo", hero3: "y para tu vida.", intro: "Elige especialistas de IA para tu trabajo: crecimiento empresarial, finanzas, ventas y gestión de personas. Cada compra de IA también incluye tu Asistente Personal para conversar, planificar, recibir recordatorios y obtener ayuda diaria.",
    benefits: ["IA especializada para lo que necesitas", "Asistente Personal gratis con cualquier compra de IA"], sectionEyebrow: "Conoce a tus especialistas", sectionTitle: "La ayuda adecuada para tu trabajo.", sectionDescription: "Un espacio para tu negocio y tus necesidades diarias, con más compañeros de IA en camino.",
    howLabel: "Diseñado para ser sencillo", howTitle: "Un poco más de espacio para tu mejor trabajo.", howDescription: "Asigna un especialista a cada tipo de trabajo, encuentra todo fácilmente y vuelve a centrarte en lo importante.", steps: [["Elige a tu compañero", "Abre al especialista que pueda ayudarte."], ["Reúne el trabajo en un solo lugar", "Ten a mano las tareas financieras y tus planes diarios."], ["Haz espacio para las personas", "Deja que la ayuda se ocupe de las tareas rutinarias."]],
    roadmap: "En nuestros planes", mobileTitle: "Tu equipo de IA, donde te lleve el día.", mobileDescription: "Las apps dedicadas para iOS y Android están en nuestros planes para que, en el futuro, tu espacio ZengenAI te acompañe.", planned: "Previsto", footer: "Creado con cuidado para trabajar mejor", workspace: "Espacio de trabajo", signInFooter: "Iniciar sesión",
    specialistNames: ["Analista financiero", "Asistente personal", "Ejecutivo de RR. HH.", "Analista de ventas"], specialistDescriptions: ["Ve más allá de las facturas: analiza objetivos, flujo de caja y formas prácticas de crecer.", "Conversa, pide ayuda, organiza planes y reúne recordatorios y tareas diarias en un solo lugar.", "Ayuda con operaciones de personal, incorporación y solicitudes habituales del equipo.", "Explora señales del mercado y oportunidades de crecimiento para destacar tu negocio."], specialistStatuses: ["Disponible", "Incluido con la compra", "Próximamente", "Próximamente"],
    preview: ["Espacio", "Mi equipo de IA", "TU ESPACIO", "Un día más claro empieza aquí.", "Compañeros de IA", "Espacio financiero", "Asistente personal", "Tus compañeros de IA", "Listos para ayudar", "Hoy de un vistazo", "Más espacio para concentrarte", "Asistente personal incluido", "vista previa del espacio"],
  },
};

function LanguageSwitcher({ language, onChange }) {
  const keys = [
    { code: "en", label: "E", name: "English" },
    { code: "ta", label: "த", name: "தமிழ்" },
    { code: "hi", label: "ह", name: "हिन्दी" },
    { code: "es", label: "Ñ", name: "Español" },
  ];
  return (
    <div aria-label="Choose website language" className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-[#15131c]/90 p-1 shadow-lg shadow-black/20" role="group">
      {keys.map(({ code, label, name }) => (
        <button aria-label={name} aria-pressed={language === code} className={`grid h-8 w-8 place-items-center rounded-full font-display text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200 ${language === code ? "bg-violet-300 text-[#171222] shadow-md shadow-violet-300/20" : "text-[#b8b1c7] hover:bg-white/[0.07] hover:text-white"}`} key={code} onClick={() => onChange(code)} type="button" title={name}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2 pt-4 whitespace-nowrap sm:gap-3" aria-label="ZengenAI">
      <span
        className="text-[32px] leading-none tracking-[0.04em] text-white sm:text-[44px]"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Zengen
      </span>
      <span className="rounded-md border border-violet-300/25 bg-violet-300/[0.08] px-1.5 py-1 font-display text-[9px] font-bold tracking-[0.18em] text-violet-200 sm:px-2.5 sm:py-2 sm:text-xs">
        AI
      </span>
    </span>
  );
}

function WorkspacePreview({ copy }) {
  return (
    <div className="relative mx-auto w-full max-w-[690px] [perspective:1400px]">
      <div className="absolute -inset-8 rounded-[40px] bg-violet-500/[0.14] blur-[70px]" />
      <div className="relative rotate-[1.2deg] overflow-hidden rounded-[22px] border border-white/[0.13] bg-[#111018] shadow-[0_35px_110px_rgba(0,0,0,0.55)] transition duration-500 hover:rotate-0">
        <div className="flex h-11 items-center gap-2 border-b border-white/[0.08] bg-[#191720] px-4">
          <i className="h-2.5 w-2.5 rounded-full bg-[#fb7185]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
          <span className="ml-4 flex h-6 flex-1 items-center justify-center rounded-md border border-white/[0.06] bg-black/20 text-[8px] tracking-wide text-[#777285]">
            zengenAI · {copy.preview[12]}
          </span>
        </div>
        <div className="grid min-h-[340px] grid-cols-[132px_1fr] max-[580px]:grid-cols-1">
          <aside className="border-r border-white/[0.07] bg-[#14121a] p-3 max-[580px]:hidden">
            <div className="mb-7 flex items-center gap-2 px-1 py-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
                <SpecialistIcon type="team" className="h-4 w-4" />
              </span>
              <span className="font-display text-[9px] font-semibold text-white">{copy.preview[0]}</span>
            </div>
            <div className="grid gap-2 text-[8px] text-[#9995a8]">
              <div className="flex items-center gap-2 rounded-lg bg-violet-300/10 px-2 py-2 text-violet-200">
                <SpecialistIcon type="team" className="h-3.5 w-3.5" /> {copy.preview[1]}
              </div>
              <div className="flex items-center gap-2 px-2 py-2">
                <SpecialistIcon type="finance" className="h-3.5 w-3.5" /> {copy.specialistNames[0]}
              </div>
              <div className="flex items-center gap-2 px-2 py-2">
                <SpecialistIcon type="assistant" className="h-3.5 w-3.5" /> {copy.specialistNames[1]}
              </div>
            </div>
          </aside>
          <div className="min-w-0 p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-[8px] font-bold tracking-[0.16em] text-violet-300">{copy.preview[2]}</p>
                <h2 className="m-0 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                  {copy.preview[3]}
                </h2>
              </div>
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#d7bea3] to-[#755b55] text-[8px] font-bold text-white">
                DK
              </div>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                ["02", copy.preview[4]],
                ["01", copy.preview[5]],
                ["FREE", copy.preview[6]],
              ].map(([value, label]) => (
                <div className="rounded-xl border border-white/[0.07] bg-[#191720] p-3" key={label}>
                  <strong className="block font-display text-sm font-semibold text-white sm:text-base">{value}</strong>
                  <span className="mt-1 block text-[7px] leading-tight text-[#898497] sm:text-[8px]">{label}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-2 max-[420px]:grid-cols-1">
              <div className="rounded-xl border border-white/[0.07] bg-[#191720] p-3.5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-white">{copy.preview[7]}</span>
                  <span className="text-[7px] text-emerald-300">{copy.preview[8]}</span>
                </div>
                <div className="grid gap-2.5">
                  {specialists.slice(0, 2).map((specialist) => (
                    <div className="flex items-center gap-2.5" key={specialist.type}>
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
                        <SpecialistIcon type={specialist.type} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate text-[8px] font-medium text-white">{copy.specialistNames[specialist.type === "finance" ? 0 : 1]}</span>
                        <span className="text-[7px] text-[#898497]">{copy.specialistStatuses[specialist.type === "finance" ? 0 : 1]}</span>
                      </div>
                      <FaCheck className="text-[8px] text-emerald-300" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-[#191720] p-3.5">
                <span className="text-[9px] font-semibold text-white">{copy.preview[9]}</span>
                <div className="mt-4 flex h-12 items-end gap-1.5">
                  {[35, 52, 42, 70, 56, 88, 68, 96, 72, 100, 76, 88].map((height, index) => (
                    <span
                      className={`flex-1 rounded-t-sm ${index === 9 ? "bg-violet-300" : "bg-violet-300/25"}`}
                      key={`${height}-${index}`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <span className="mt-2 block text-[7px] text-[#898497]">{copy.preview[10]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-6 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#191720]/95 px-3 py-2.5 text-[9px] text-white shadow-xl sm:flex">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-violet-300/10 text-violet-200">
          <SpecialistIcon type="assistant" className="h-3.5 w-3.5" />
        </span>
        {copy.preview[11]}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const [language, setLanguage] = useState(() => localStorage.getItem("zengenai-landing-language") || "en");
  const copy = landingCopy[language] || landingCopy.en;
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("zengenai-landing-language", nextLanguage);
  };
  const accessPath = user ? "/workspace" : "/login";

  return (
    <main lang={language} className="landing-page min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_15%_8%,rgba(102,72,151,0.2),transparent_35%),radial-gradient(ellipse_at_88%_35%,rgba(83,65,126,0.17),transparent_38%),linear-gradient(145deg,#100e17,#0c0b12_55%,#100e17)] text-[#f5f3ff]">
      <header className="relative z-10 mx-auto flex w-full max-w-[1320px] items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" aria-label="ZengenAI home">
          <Wordmark />
        </Link>
        <nav className="hidden items-center gap-8 text-[11px] text-[#aaa4b8] md:flex" aria-label="Website navigation">
          <a className="transition hover:text-white" href="#team">{copy.nav[0]}</a>
          <a className="transition hover:text-white" href="#pricing">{copy.nav[1]}</a>
          <a className="transition hover:text-white" href="#how-it-works">{copy.nav[2]}</a>
          <a className="transition hover:text-white" href="#mobile">{copy.nav[3]}</a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher language={language} onChange={changeLanguage} />
          <Link
            className="hidden rounded-lg px-3 py-2.5 text-[10px] font-semibold text-[#d3cde0] transition hover:bg-white/[0.05] hover:text-white sm:inline-flex sm:px-4"
            to={accessPath}
          >
            {copy.signIn}
          </Link>
          <Link
            className="rounded-lg border border-violet-200/20 bg-violet-300 px-4 py-2.5 text-[10px] font-bold text-[#171222] shadow-lg shadow-violet-400/10 transition hover:bg-violet-200 sm:px-5"
            to={accessPath}
          >
            {user ? copy.open : copy.login}
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid min-h-[670px] w-full max-w-[1320px] items-center gap-16 px-6 pb-24 pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div className="relative z-[1] max-w-[540px]">
          <p className="mb-5 flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] text-violet-300">
            <span className="h-px w-6 bg-violet-300" /> {copy.eyebrow}
          </p>
          <h1 className={`mb-5 max-w-full font-display font-semibold text-white ${language === "ta" ? "break-words text-[clamp(36px,4.2vw,58px)] leading-[1.28] tracking-normal [overflow-wrap:anywhere]" : "text-[clamp(42px,5.8vw,76px)] leading-[1.02] tracking-[-0.065em]"}`}>
            {language === "ta" ? (
              <>
                {copy.hero1}{" "}
                <span className="bg-gradient-to-r from-violet-200 via-[#c4a7ff] to-[#8f7bdd] bg-clip-text text-transparent">{copy.hero2}</span>{" "}
                {copy.hero3}
              </>
            ) : (
              <>
                {copy.hero1}
                <br />
                <span className="bg-gradient-to-r from-violet-200 via-[#c4a7ff] to-[#8f7bdd] bg-clip-text text-transparent">{copy.hero2}</span>
                <br />
                {copy.hero3}
              </>
            )}
          </h1>
          <p className="mb-8 max-w-[470px] text-sm leading-7 text-[#aaa4b8] sm:text-[15px]">
            {copy.intro}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex items-center gap-2.5 rounded-lg bg-violet-300 px-5 py-3.5 text-[10px] font-bold text-[#171222] shadow-xl shadow-violet-400/15 transition hover:-translate-y-0.5 hover:bg-violet-200"
              to={accessPath}
            >
              {user ? copy.openYour : copy.start} <FaArrowRight />
            </Link>
            <a
              className="rounded-lg border border-white/10 px-5 py-3.5 text-[10px] font-semibold text-white transition hover:border-violet-200/30 hover:bg-white/[0.04]"
              href="#team"
            >
              {copy.meet}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] text-[#898497]">
            <span className="inline-flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {copy.benefits[0]}</span>
            <span className="inline-flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-violet-300" /> {copy.benefits[1]}</span>
          </div>
        </div>
        <div className="relative z-[1] py-8 lg:py-0">
          <WorkspacePreview copy={copy} />
        </div>
        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-200/15 to-transparent lg:left-10 lg:right-10" />
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24" id="team">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[620px]">
            <p className="mb-3 text-[9px] font-bold tracking-[0.18em] text-violet-300">{copy.sectionEyebrow}</p>
            <h2 className="m-0 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
              {copy.sectionTitle}
            </h2>
          </div>
          <p className="mb-1 max-w-[350px] text-xs leading-relaxed text-[#9995a8]">
            {copy.sectionDescription}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-3 max-[1050px]:grid-cols-2 max-[600px]:grid-cols-1">
          {specialists.map((specialist) => (
            <article
              className="group rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#191720] to-[#121119] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              key={specialist.type}
            >
              <div className="mb-8 flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] ${specialist.tone}`}>
                  <SpecialistIcon type={specialist.type} className="h-5 w-5" />
                </span>
                <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[8px] text-[#aaa4b8]">
                  {copy.specialistStatuses[specialists.indexOf(specialist)]}
                </span>
              </div>
              <h3 className="mb-2 font-display text-base font-semibold text-white">AI {copy.specialistNames[specialists.indexOf(specialist)]}</h3>
              <p className="mb-0 min-h-[58px] text-[10px] leading-relaxed text-[#9995a8]">{copy.specialistDescriptions[specialists.indexOf(specialist)]}</p>
              <span className="sr-only">{copy.specialistStatuses[specialists.indexOf(specialist)]}</span>
            </article>
          ))}
        </div>
      </section>

      <PricingPlans language={language} />

      <section className="border-y border-white/[0.06] bg-white/[0.015]" id="how-it-works">
        <div className="mx-auto grid w-full max-w-[1320px] gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24">
          <div>
            <p className="mb-3 text-[9px] font-bold tracking-[0.18em] text-violet-300">{copy.howLabel}</p>
            <h2 className="mb-4 font-display text-3xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-4xl">
              {copy.howTitle}
            </h2>
            <p className="max-w-[440px] text-xs leading-6 text-[#9995a8]">
              {copy.howDescription}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["01", ...copy.steps[0]],
              ["02", ...copy.steps[1]],
              ["03", ...copy.steps[2]],
            ].map(([number, title, description]) => (
              <article className="rounded-2xl border border-white/[0.07] bg-[#15131c] p-5" key={number}>
                <span className="font-display text-sm font-semibold text-violet-300">{number}</span>
                <h3 className="mb-2 mt-8 font-display text-sm font-semibold text-white">{title}</h3>
                <p className="mb-0 text-[10px] leading-relaxed text-[#9995a8]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-6 py-20 lg:px-10 lg:py-24" id="mobile">
        <div className="relative overflow-hidden rounded-[26px] border border-violet-200/15 bg-gradient-to-br from-[#211b31] via-[#1a1725] to-[#151822] p-8 sm:p-12">
          <div className="absolute -right-24 -top-36 h-[420px] w-[420px] rounded-full border border-violet-200/[0.08]" />
          <div className="absolute -right-4 -top-16 h-[300px] w-[300px] rounded-full border border-dashed border-violet-200/[0.12]" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <div className="max-w-[620px]">
              <p className="mb-3 text-[9px] font-bold tracking-[0.18em] text-violet-200">{copy.roadmap}</p>
              <h2 className="mb-4 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">
                {copy.mobileTitle}
              </h2>
              <p className="mb-6 max-w-[560px] text-xs leading-6 text-[#aaa4b8]">
              {copy.mobileDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-[9px] font-medium text-white">
                  <FaMobileAlt className="text-violet-200" /> iOS app · Planned
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/15 px-3 py-2 text-[9px] font-medium text-white">
                  <FaMobileAlt className="text-emerald-200" /> Android app · Planned
                </span>
              </div>
            </div>
            <div className="relative mx-auto flex h-[170px] w-[150px] items-center justify-center md:mr-8">
              <div className="absolute h-[160px] w-[160px] rounded-full border border-violet-200/15 animate-feature-ring-wave" />
              <div className="relative h-[132px] w-[72px] rounded-[20px] border border-violet-100/30 bg-gradient-to-b from-[#342a49] to-[#17141e] p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.4)]">
                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[15px] border border-white/[0.06] bg-[#17141e]">
                  <span className="h-1 w-7 rounded-full bg-white/20" />
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-300/10 text-violet-200">
                    <SpecialistIcon type="team" className="h-6 w-6" />
                  </span>
                  <span className="h-1 w-5 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] px-6 py-6 text-[9px] text-[#777285] lg:px-10">
        <Link to="/" aria-label="ZengenAI home"><Wordmark /></Link>
        <span>{copy.footer} <b className="text-violet-300">✦</b></span>
        <Link className="transition hover:text-violet-200" to={accessPath}>{user ? copy.workspace : copy.signInFooter}</Link>
      </footer>
    </main>
  );
}
