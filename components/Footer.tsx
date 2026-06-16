import { ContactForm } from '@/components/ContactForm'
import Link from 'next/link'

export function Footer() {
  return (
    <footer id="kontakt" className="site-footer">
      <div className="footer-contact">
        <div>
          <h2>Schreibe uns gerne:</h2>
          <p>Ob Verkündigung, Bildung oder Engagement – wir unterstützen dich, damit deine Botschaft Menschen erreicht.</p>
        </div>
        <ContactForm />
      </div>
      <div className="footer-columns">
        <div><h3>Informationen</h3><Link href="/#podcast1">Podcast</Link><Link href="/#equipment">Unser Equipment</Link></div>
        <div><h3>Informationen</h3><Link href="/#team">Unser Team</Link><Link href="/#preise">Preismodelle</Link></div>
        <div><h3>Kontakt aufnehmen</h3><a href="tel:+436767923929">+43 676 792 39 29</a><a href="mailto:studio@wilckeworte.at">studio@wilckeworte.at</a></div>
        <div><h3>Studio</h3><p>Grenzgasse 4<br />3001 Mauerbach</p><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
      </div>
      <p className="copyright">© Copyright by Wilcke, Worte und Visionen {new Date().getFullYear()}</p>
    </footer>
  )
}
