export interface HeroContent {
  tagline: string
  headline: string
  subline: string
  cta_primary: string
  cta_secondary: string
}

export interface Service {
  num: string
  title: string
  subtitle: string
  description: string
  image_label: string
}

export interface ProcessStep {
  num: string
  title: string
  description: string
}

export interface Paket {
  id: string
  name: string
  sub: string
  preis: number
  einheit: 'einmalig' | 'monatlich'
  features: string[]
  empfohlen: boolean
}

export interface EquipmentItem {
  name: string
  description: string
  preis_tag: number | null
  image_label: string
}

export interface TeamMember {
  name: string
  rolle: string
  kurz_bio: string
}

export interface CTAContent {
  headline: string
  subline: string
  button: string
}

export interface ContactInfo {
  telefon: string
  email: string
  adresse: string
}

export const siteContent = {
  hero: {
    tagline: "Kreatives Studio für Wort, Bild und Klang",
    headline: "Deine Botschaft. Professionell erzählt.",
    subline: "Podcast, Video, Livestream — wir begleiten Pfarren, Initiativen und Kreative von der ersten Idee bis zur Veröffentlichung.",
    cta_primary: "Projekt starten",
    cta_secondary: "Preise ansehen",
  },

  services: [
    {
      num: "01",
      title: "Podcast",
      subtitle: "& Audio",
      description: "Vom geistlichen Impuls bis zur Interviewreihe — professionell produziert, auf allen Plattformen. Schnitt, Musik, Hosting und Shorts inklusive.",
      image_label: "Studio-Mikrofon / SM7B Close-Up",
    },
    {
      num: "02",
      title: "Video",
      subtitle: "& Film",
      description: "4K-Produktionen mit Kinoästhetik. Dokumentation, Formatentwicklung, Farbkorrektur — deine Geschichte im richtigen Licht.",
      image_label: "Kamera S1H / Gimbal-Shot",
    },
    {
      num: "03",
      title: "Livestream",
      subtitle: "& Events",
      description: "Mehrkamera-Livestreams mit Bildregie, Bauchbinden und direkter Ausspielung auf YouTube, Facebook oder deine Website.",
      image_label: "Livestream-Setup / ATEM Mischer",
    },
  ],

  process: [
    { num: "01", title: "Idee", description: "Deine Vision — wir hören zu und bringen Struktur hinein." },
    { num: "02", title: "Konzept", description: "Format, Technik und Ablauf — individuell und realisierbar." },
    { num: "03", title: "Produktion", description: "Vom Dreh bis zur Veröffentlichung — sendebereit." },
  ],

  pakete: {
    selbstproduktion: [
      { id: "A1", name: "Studiotag", sub: "Do it Yourself", preis: 120, einheit: "einmalig" as const, features: ["Bis zu 3 Stunden Nutzung", "Studio: Kamera, Ton, Licht, Greenscreen", "Einschulung inklusive"], empfohlen: false },
      { id: "A2", name: "Monatsabo", sub: "Regelmäßiger Studiozugang", preis: 290, einheit: "monatlich" as const, features: ["4 Termine/Monat à 2 Std.", "Flexible Zeiteinteilung", "Technikcheck inklusive"], empfohlen: true },
      { id: "A3", name: "Studio PLUS", sub: "Betreute Selbstproduktion", preis: 350, einheit: "monatlich" as const, features: ["Alles aus A2", "Setup-Unterstützung", "Qualitätskontrolle"], empfohlen: false },
    ],
    voller_service: [
      { id: "B1", name: "Monatsimpuls", sub: "Voller Service", preis: 190, einheit: "monatlich" as const, features: ["1 Folge/Monat à 45 min", "Schnitt, Musik, Bereitstellung", "Shorts für alle Plattformen"], empfohlen: false },
      { id: "B2", name: "Mehrere Folgen", sub: "Voller Service", preis: 390, einheit: "monatlich" as const, features: ["2 Folgen/Monat à 45 min", "Bearbeitung, Grafiken, Upload", "Formatpflege inkl. Shorts"], empfohlen: true },
      { id: "B4", name: "Tagesimpulse", sub: "Monatsreihe", preis: 490, einheit: "monatlich" as const, features: ["30 kurze Impulse (1–3 Min.)", "1 Aufnahmetag, Rest übernehmen wir", "Ideal für Advent, Fastenzeit"], empfohlen: false },
    ],
  },

  equipment_highlights: [
    { name: "Panasonic Lumix S1H", description: "Netflix-approved Cinema-Kamera. 6K intern, Dual Native ISO, V-Log — auch zum Verleih.", preis_tag: 50, image_label: "Lumix S1H Produktfoto" },
    { name: "Shure SM7B", description: "Broadcast-Standard für Podcast und Voiceover. Dreifach vorhanden im Studio.", preis_tag: null, image_label: "SM7B am Stativ mit Pop-Filter" },
    { name: "Studio Mauerbach", description: "LED Panels, Greenscreen, Gimbal, ATEM Mischer — alles für deine Produktion unter einem Dach.", preis_tag: null, image_label: "Studio-Gesamtansicht / Weitwinkel" },
  ],

  team: [
    { name: "Adina Wilcke", rolle: "Kommunikation & Rhetorik", kurz_bio: "Poetry Slammerin, Schauspielerin und Moderatorin mit Gespür für Sprache und Wirkung." },
    { name: "Jeremias Wilcke", rolle: "Studioleiter & Produzent", kurz_bio: "Medienschaffender an der Schnittstelle von Kirche, Kultur und Kommunikation." },
    { name: "Felix Heisz", rolle: "Editor", kurz_bio: "Versierter Cutter mit feinem Gespür für Bild, Ton und Rhythmus." },
    { name: "Thomas Buswell", rolle: "Bildregie", kurz_bio: "Sicheres Auge für Komposition und Timing bei Studioproduktionen." },
  ],

  cta: {
    headline: "Deine Botschaft verdient es, gehört zu werden.",
    subline: "Podcast, Video oder Livestream — wir finden gemeinsam das richtige Format.",
    button: "Nachricht senden",
  },

  contact: {
    telefon: "+43 676 792 39 29",
    email: "studio@wilckeworte.at",
    adresse: "Grenzgasse 4, 3001 Mauerbach",
  },
} as const
