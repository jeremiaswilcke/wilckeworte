/**
 * Seed-Script: Schreibt Seed-Daten ins WordPress via REST API.
 * Aufruf: npx tsx scripts/seed.ts
 *
 * Benötigt WP Application Password:
 * WP_REST_URL=https://wilckeworte.at/wp-json
 * WP_USER=admin
 * WP_APP_PASSWORD=xxxx xxxx xxxx xxxx
 */

import { siteContent } from '../lib/seed-data'
import * as fs from 'fs'
import * as path from 'path'

const WP_REST_URL = process.env.WP_REST_URL ?? 'https://wilckeworte.at/wp-json'
const WP_USER = process.env.WP_USER ?? ''
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD ?? ''

const auth = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64')

async function wpPost(endpoint: string, data: Record<string, unknown>) {
  const res = await fetch(`${WP_REST_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`WP API Error ${res.status}: ${text}`)
  }
  return res.json()
}

async function seedPakete() {
  console.log('Seeding Pakete...')
  for (const [kategorie, pakete] of Object.entries(siteContent.pakete)) {
    for (const paket of pakete) {
      try {
        await wpPost('/wp/v2/paket', {
          title: paket.name,
          status: 'publish',
          acf: {
            kategorie,
            paket_id: paket.id,
            titel: paket.name,
            untertitel: paket.sub,
            preis: paket.preis,
            preis_einheit: paket.einheit,
            features: paket.features.map(f => ({ feature: f })),
            empfohlen: paket.empfohlen,
          },
        })
        console.log(`  ✓ ${paket.name}`)
      } catch (e) {
        console.error(`  ✗ ${paket.name}:`, e)
      }
    }
  }
}

async function seedEquipment() {
  console.log('Seeding Equipment...')
  for (const item of siteContent.equipment_highlights) {
    try {
      await wpPost('/wp/v2/equipment', {
        title: item.name,
        status: 'publish',
        acf: {
          preis_tag: item.preis_tag,
          besonderheit: item.description,
        },
      })
      console.log(`  ✓ ${item.name}`)
    } catch (e) {
      console.error(`  ✗ ${item.name}:`, e)
    }
  }
}

async function seedTeam() {
  console.log('Seeding Team...')
  for (let i = 0; i < siteContent.team.length; i++) {
    const member = siteContent.team[i]
    try {
      await wpPost('/wp/v2/team_mitglied', {
        title: member.name,
        status: 'publish',
        acf: {
          rolle: member.rolle,
          kurz_bio: member.kurz_bio,
          reihenfolge: i + 1,
        },
      })
      console.log(`  ✓ ${member.name}`)
    } catch (e) {
      console.error(`  ✗ ${member.name}:`, e)
    }
  }
}

function generateExportJSON() {
  const exportData = {
    pakete: Object.entries(siteContent.pakete).flatMap(([kategorie, pakete]) =>
      pakete.map(p => ({ ...p, kategorie }))
    ),
    equipment: siteContent.equipment_highlights,
    team: siteContent.team.map((m, i) => ({ ...m, reihenfolge: i + 1 })),
  }

  const outPath = path.join(__dirname, 'seed-export.json')
  fs.writeFileSync(outPath, JSON.stringify(exportData, null, 2))
  console.log(`\nExport written to ${outPath}`)
}

async function main() {
  if (!WP_USER || !WP_APP_PASSWORD) {
    console.log('No WP credentials found. Generating JSON export instead...')
    generateExportJSON()
    return
  }

  try {
    await seedPakete()
    await seedEquipment()
    await seedTeam()
    console.log('\nSeeding complete!')
  } catch (e) {
    console.error('Seeding failed:', e)
    console.log('Generating JSON fallback...')
    generateExportJSON()
  }
}

main()
