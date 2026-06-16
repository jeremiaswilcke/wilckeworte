'use client'

import Image from 'next/image'
import { useState } from 'react'
import { BookingModal } from '@/components/BookingModal'

const packages = [
  { id: 'A1', name: 'Studiotag', subtitle: 'Do it Yourself', price: 120, unit: 'einmalig', category: 'selbstproduktion', features: ['Bis zu 3 Stunden Nutzung', 'Kamera, Ton, Licht und Greenscreen', 'Kurze Einschulung inklusive'] },
  { id: 'A2', name: 'Monatsabo Selbstproduktion', subtitle: 'Regelmäßiger Studiozugang', price: 290, unit: 'monatlich', category: 'selbstproduktion', features: ['4 Studiotermine pro Monat à 2 Stunden', 'Flexible Zeiteinteilung', 'Grundbetreuung und Technikcheck'] },
  { id: 'A3', name: 'Studio PLUS', subtitle: 'Betreute Selbstproduktion', price: 350, unit: 'monatlich', category: 'selbstproduktion', features: ['Alle Leistungen aus A2', 'Unterstützung bei Kamera, Ton und Licht', 'Kurze Qualitätskontrolle'] },
  { id: 'B1', name: 'Monatsimpuls', subtitle: 'Voller Service', price: 190, unit: 'monatlich', category: 'voller_service', features: ['Eine Folge pro Monat', 'Schnitt, Musik und Bereitstellung', 'Shorts für alle Plattformen'] },
  { id: 'B2', name: 'Mehrere Folgen', subtitle: 'Voller Service', price: 390, unit: 'monatlich', category: 'voller_service', features: ['Zwei lange oder vier kurze Folgen', 'Bearbeitung, Grafiken und Uploadhilfe', 'Monatliche Formatpflege'] },
  { id: 'B3', name: 'Wochenreihe', subtitle: 'Gebündelt aufgenommen', price: 290, unit: 'monatlich', category: 'voller_service', features: ['Sieben kurze Impulse', 'Ein gemeinsamer Aufnahmetag', 'Schnitt und Uploadbereitstellung'] },
  { id: 'B4', name: 'Tagesimpulse', subtitle: 'Monatsreihe', price: 490, unit: 'monatlich', category: 'voller_service', features: ['30 bis 31 kurze Impulse', 'Ein gemeinsamer Aufnahmetag', 'Ideal für Advent und Fastenzeit'] },
] as const

const rentalItems = [
  { name: 'Panasonic Lumix S 20–60 mm f/3.5–5.6', category: 'Objektiv', price: 15, weekend: 35 },
  { name: 'Sigma 105 mm f/2.8 DG DN Macro Art', category: 'Objektiv', price: 20, weekend: 45 },
  { name: 'Panasonic Lumix S5', category: 'Kamera', price: 30, weekend: 70 },
  { name: 'Panasonic Lumix S5D', category: 'Kamera', price: 30, weekend: 70 },
  { name: 'Panasonic Lumix S5II', category: 'Kamera', price: 40, weekend: 100 },
  { name: 'Panasonic Lumix S1H', category: 'Kamera', price: 50, weekend: 120 },
] as const

const team = [
  { name: 'Adina Wilcke', role: 'Kommunikations- und Rhetorikcoach, Körpersprachenexpertin', image: '/media/adina.png', text: 'Poetry Slammerin, Schauspielerin, Sprecherin und Moderatorin. Sie verbindet künstlerischen Ausdruck mit professioneller Präsenz und einem tiefen Gespür für Sprache und Wirkung.' },
  { name: 'Jeremias Wilcke', role: 'Studioleiter und Produzent', image: '/media/jeremias.png', text: 'Medienschaffender, Produzent und Autor. Er entwickelt Formate an der Schnittstelle von Kirche, Kultur und Kommunikation und begleitet Projekte von der Idee bis zur Veröffentlichung.' },
  { name: 'Felix Heisz', role: 'Editor', image: '/media/felix.png', text: 'Cutter, Editor sowie Studio- und Veranstaltungstechniker mit sicherer Hand und feinem Gespür für Bild, Ton und Rhythmus.' },
  { name: 'Thomas Buswell', role: 'Bildregie', image: '/media/thomas.png', text: 'Verantwortet die Bildregie bei Studioproduktionen und sorgt mit sicherem Auge für Komposition, Timing und Atmosphäre.' },
] as const

export function HomeReplica() {
  const [selectedPackage, setSelectedPackage] = useState<(typeof packages)[number] | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)

  return (
    <>
      <section id="studio" className="scroll-unit studio-unit">
        <div className="unit-inner studio-grid">
          <div className="studio-copy">
            <p className="eyebrow">Das Studio</p>
            <h1>Dein Projekt. Unsere Technik.</h1>
            <div className="studio-intro">
              <strong>Kein Problem. Wir helfen dir.</strong>
              <p>Ob Pfarre, Gemeinde oder gemeinnützige Organisation: Du hast eine Botschaft – wir sorgen dafür, dass sie gehört wird.</p>
              <p>Mit technischer Erfahrung, redaktionellem Know-how und einem tiefen Verständnis für sinnstiftende Kommunikation begleiten wir dich von der ersten Idee bis zur Veröffentlichung.</p>
              <strong>Wilcke Worte und Visionen – Medien für Menschen mit Mission.</strong>
            </div>
            <div className="process-stack">
              <article><span>▤</span><div><h3>Ideenfindung</h3><p>Deine Vision – wir hören zu und bringen Struktur hinein.</p></div></article>
              <article><span>▦</span><div><h3>Planung & Konzept</h3><p>Wir entwickeln Format, Technik und Ablauf – einfach und machbar.</p></div></article>
              <article><span>◉</span><div><h3>Umsetzung</h3><p>Vom Dreh bis zur Veröffentlichung: Wir machen dein Projekt sendebereit.</p></div></article>
            </div>
          </div>
          <div className="studio-visual">
            <Image src="/media/hero-mark.png" alt="" width={520} height={520} className="hero-mark" priority />
            <span className="work-label">View our work</span>
            <Image src="/media/studio-light.jpg" alt="Studiolicht im Wilcke-Worte-Studio" width={1038} height={1512} className="studio-light" priority />
          </div>
        </div>
      </section>

      <section id="podcast1" className="scroll-unit podcast-intro">
        <div className="unit-inner split-unit">
          <div>
            <p className="eyebrow light">Podcasts</p>
            <h2>Was ist ein Podcast?</h2>
            <h3>Podcasts verstehen – einfach erklärt</h3>
            <p>Ein Podcast ist eine Serie von Audio- oder Videoaufnahmen, die regelmäßig veröffentlicht werden – wie eine eigene Radio- oder Fernsehsendung, die man hören oder ansehen kann, wann und wo man will.</p>
            <p>Menschen hören gerne Stimmen, denen sie vertrauen. Deshalb eignen sich Podcasts hervorragend für Pfarren, NGOs, Vereine oder Einzelpersonen, die etwas zu sagen haben.</p>
            <p>Ein Podcast kann wenige Minuten oder eine ganze Stunde dauern, im Studio oder über Distanz aufgenommen, live gestreamt oder aufwendig nachbearbeitet werden.</p>
          </div>
          <Image src="/media/studio-wide.jpg" alt="Podcast-Aufnahme im Studio" width={1280} height={960} />
        </div>
      </section>

      <section id="podcast" className="scroll-unit podcast-types">
        <div className="unit-inner podcast-columns">
          <article>
            <h2>🔊 Audiopodcast</h2>
            <h3>Die Kraft des gesprochenen Wortes – ganz ohne Kamera</h3>
            <p>Ein Audiopodcast ist ein Format, bei dem nur der Ton aufgenommen wird. Das Ergebnis ist über Spotify, Apple Podcasts oder die eigene Website abrufbar.</p>
            <h4>Besonders geeignet für</h4>
            <ul>
              <li>Geistliche Impulse, Predigten und Gedanken zur Woche</li>
              <li>Interviews und gesellschaftliche Debatten</li>
              <li>Erfahrungsberichte und persönliche Geschichten</li>
              <li>Informationen aus Gemeinde oder Organisation</li>
            </ul>
          </article>
          <article>
            <h2>🎥 Videopodcast</h2>
            <h3>Wenn Worte ein Gesicht bekommen</h3>
            <p>Ein Videopodcast wird zusätzlich gefilmt. Mimik, Gestik und Atmosphäre schaffen Nähe und machen Inhalte für YouTube und Social Media vielseitig nutzbar.</p>
            <h4>Technisch möglich</h4>
            <ul>
              <li>Aufzeichnung mit bis zu 4K</li>
              <li>Mehrere Kameras und externe Gesprächspartner</li>
              <li>Livestream auf YouTube oder Social Media</li>
              <li>Musik, Bauchbinden und Untertitel</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="preise" className="scroll-unit pricing-unit">
        <div className="unit-inner">
          <div className="pricing-heading">
            <h2>Wie schaut die preisliche Gestaltung aus?</h2>
            <a href="#kontakt">Jetzt Kontakt aufnehmen</a>
          </div>
          <div className="steps-row">
            <article><b>01</b><p>Wir nehmen uns Zeit für deine Idee, hören zu und sammeln gemeinsam Gedanken.</p></article>
            <article><b>02</b><p>Wir klären Format, Aufwand und den passenden Weg transparent und realistisch.</p></article>
            <article><b>03</b><p>Mit Struktur und unserem Team setzen wir dein Projekt professionell und verlässlich um.</p></article>
          </div>
          <div className="package-grid">
            {packages.map((item) => (
              <article className="package-card" key={item.id}>
                <small>{item.id} · {item.subtitle}</small>
                <h3>{item.name}</h3>
                <div className="price">€ {item.price}<span>/{item.unit === 'monatlich' ? 'monatlich' : 'einmalig'}</span></div>
                <ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <button onClick={() => setSelectedPackage(item)}>Anfragen</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-unit rental-unit">
        <div className="unit-inner">
          <p className="eyebrow">Verleih</p>
          <h2>Equipment ausleihen</h2>
          <div className="rental-grid">
            {rentalItems.map((item) => (
              <article key={item.name}>
                <small>{item.category}</small>
                <h3>{item.name}</h3>
                <p>Professionelles Equipment aus unserem Studio. Ab drei Tagen gelten vergünstigte Konditionen.</p>
                <div><b>{item.price} €/Tag</b><span>{item.weekend} €/Wochenende</span></div>
                <button onClick={() => setSelectedEquipment(item.name)}>Auswählen</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="equipment" className="scroll-unit equipment-list">
        <div className="unit-inner">
          <h2>Unser Equipment</h2>
          <div className="equipment-columns">
            <article><h3>🎙️ Audio & Sprachaufnahmen</h3><p>Shure SM7B (3×) · AKG C414 XLS · Rode PodMic (2×) · Rode NTG4+ · dbx 286s (3×) · ART Pro MPA II</p></article>
            <article><h3>🎚️ Audio-Interfaces & Mischpulte</h3><p>MOTU UltraLite AVB · Audient EVO 16 · ATEM Production Studio 4K</p></article>
            <article><h3>🎥 Video & Capture</h3><p>Panasonic Lumix S5, S5II, S5D und S1H · Manfrotto Gimbal · Atomos Ninja V · AverMedia Capture-Karten</p></article>
            <article><h3>💡 Licht & Greenscreen</h3><p>NEEWER LED Panels · Rollei LUX Candela · RGB Backlights · Greenscreen-Beleuchtung</p></article>
            <article><h3>🖥️ Schnitt & Postproduktion</h3><p>Mac Mini M2 Pro · MacBook Pro M1 Pro · Adobe Creative Cloud · Final Cut Pro · Logic Pro · Ableton Live · Cubase 12</p></article>
          </div>
        </div>
      </section>

      <section id="team" className="scroll-unit team-unit">
        <div className="unit-inner">
          <p className="eyebrow">Unser Team</p>
          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name}>
                <Image src={member.image} alt={member.name} width={640} height={760} />
                <div><h2>{member.name}</h2><h3>{member.role}</h3><p>{member.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BookingModal
        open={Boolean(selectedPackage)}
        onClose={() => setSelectedPackage(null)}
        type="paket"
        paket={selectedPackage ? {
          paket_id: selectedPackage.id,
          paket_name: selectedPackage.name,
          kategorie: selectedPackage.category,
          preis: selectedPackage.price,
          einheit: selectedPackage.unit,
        } : undefined}
      />
      <BookingModal
        open={Boolean(selectedEquipment)}
        onClose={() => setSelectedEquipment(null)}
        type="equipment"
        equipment={selectedEquipment ? { equipment_name: selectedEquipment } : undefined}
      />
    </>
  )
}
