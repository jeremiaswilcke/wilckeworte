export const GET_PAKETE = `
  query GetPakete($kategorie: String) {
    pakete(where: { metaQuery: { metaArray: [{ key: "kategorie", value: $kategorie }] } }, first: 100) {
      nodes {
        id
        title
        acfPaket {
          kategorie
          paketId
          titel
          untertitel
          preis
          preisEinheit
          beschreibung
          features {
            feature
          }
          empfohlen
        }
      }
    }
  }
`

export const GET_EQUIPMENT = `
  query GetEquipment($kategorie: String) {
    equipments(
      where: { taxQuery: { taxArray: [{ taxonomy: EQUIPMENTKATEGORIE, terms: [$kategorie], field: SLUG }] } }
      first: 100
    ) {
      nodes {
        id
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        acfEquipment {
          preisTag
          preisWochenende
          einsatz
          besonderheit
        }
        equipmentKategorien {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`

export const GET_TEAM_MITGLIEDER = `
  query GetTeam {
    teamMitglieder(first: 20, where: { orderby: { field: META_VALUE, metaKey: "reihenfolge", order: ASC } }) {
      nodes {
        id
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        acfTeam {
          rolle
          kurzBio
          vollBio
          reihenfolge
        }
      }
    }
  }
`

export const GET_POSTS = `
  query GetPosts($first: Int = 12, $after: String) {
    posts(first: $first, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        slug
        title
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        seo {
          title
          metaDesc
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export const GET_POST_BY_SLUG = `
  query GetPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      excerpt
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        title
        metaDesc
        opengraphImage {
          sourceUrl
        }
      }
    }
  }
`

export const GET_ALL_SLUGS = `
  query GetAllSlugs {
    posts(first: 1000) {
      nodes {
        slug
      }
    }
  }
`
