// WP GraphQL Response Types

export interface WPPaket {
  id: string
  title: string
  acfPaket: {
    kategorie: 'selbstproduktion' | 'voller_service'
    paketId: string
    titel: string
    untertitel: string
    preis: number
    preisEinheit: 'einmalig' | 'monatlich'
    beschreibung: string
    features: { feature: string }[]
    empfohlen: boolean
  }
}

export interface WPEquipment {
  id: string
  title: string
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
    }
  } | null
  acfEquipment: {
    preisTag: number | null
    preisWochenende: number | null
    einsatz: string
    besonderheit: string
  }
  equipmentKategorien: {
    nodes: { name: string; slug: string }[]
  }
}

export interface WPTeamMitglied {
  id: string
  title: string
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
    }
  } | null
  acfTeam: {
    rolle: string
    kurzBio: string
    vollBio: string
    reihenfolge: number
  }
}

export interface WPPost {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  content: string
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
    }
  } | null
  seo?: {
    title: string
    metaDesc: string
    opengraphImage?: {
      sourceUrl: string
    }
  }
}

export interface WPPaketeResponse {
  pakete: { nodes: WPPaket[] }
}

export interface WPEquipmentResponse {
  equipments: { nodes: WPEquipment[] }
}

export interface WPTeamResponse {
  teamMitglieder: { nodes: WPTeamMitglied[] }
}

export interface WPPostsResponse {
  posts: { nodes: WPPost[] }
}

export interface WPPostResponse {
  post: WPPost
}
