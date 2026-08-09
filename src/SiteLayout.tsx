import { Link, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import type { ReactNode } from 'react'
import portrait from '../images/Portrait-2 copy.png'

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

export const bookingUrl = import.meta.env.VITE_BOOKING_URL || 'https://calendar.google.com/calendar/u/0/r/eventedit'

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children: ReactNode }) {
  return (
    <section className="page-intro">
      <p className="section-label">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="page-intro-copy">{children}</div>
    </section>
  )
}

export default function SiteLayout() {
  const { pathname } = useLocation()
  const [contactMenuOpen, setContactMenuOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <Link className="brand header-brand" to="/" aria-label="Andrea Janela Soliven home">
          <span className="brand-mark"><img src={portrait} alt="" /></span>
          <span className="brand-identity">
            <span>ANDREA JANELA SOLIVEN, ECE</span>
            <small>EXECUTIVE UNIT MANAGER · EXCLUSIVE LEVEL FINANCIAL ADVISOR</small>
			<small className="brand-company">PRU LIFE UK</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link className={pathname === '/about' ? 'active' : ''} to="/about">About</Link>
          <Link className={pathname === '/career' ? 'active' : ''} to="/career">Career</Link>
          <Link className={pathname === '/faq' ? 'active' : ''} to="/faq">FAQ</Link>
          <Link className={pathname === '/contact' ? 'active' : ''} to="/contact">Contact</Link>
          <Link className={pathname === '/book' ? 'active' : ''} to="/book">Book a call</Link>
        </nav>
        <Link className="header-cta" to="/assessment">Free assessment <Arrow /></Link>
      </header>
      <Outlet />
      <div className="floating-contact-wrap">
        {contactMenuOpen && <div id="contact-options" className="floating-contact-menu" role="menu" aria-label="Contact Andrea">
          <a href="https://m.me/engrandeng/" target="_blank" rel="noreferrer" role="menuitem">
            <span className="contact-channel-icon messenger" aria-hidden="true">✉</span>
            <span><strong>Messenger</strong><small>Reach Andrea via Facebook</small></span>
          </a>
          <a href="https://wa.me/engrandeng/" target="_blank" rel="noreferrer" role="menuitem">
            <span className="contact-channel-icon whatsapp" aria-hidden="true">◔</span>
            <span><strong>WhatsApp</strong><small>Great for OFWs abroad</small></span>
          </a>
          <Link to="/contact" role="menuitem" onClick={() => setContactMenuOpen(false)}>
            <span className="contact-channel-icon inquiry" aria-hidden="true">↗</span>
            <span><strong>Send an inquiry</strong><small>Use the contact form</small></span>
          </Link>
        </div>}
        <button className="floating-contact" type="button" onClick={() => setContactMenuOpen((open) => !open)} aria-expanded={contactMenuOpen} aria-controls="contact-options">
        <span className="floating-contact-icon" aria-hidden="true"><img src={portrait} alt="" /></span>
        <span className="floating-contact-copy">
          <small>Advisor online</small>
          <strong>Talk with Andeng</strong>
        </span>
        </button>
      </div>
      <footer className="site-footer">
        <div className="footer-intro"><div className="footer-brand"><span className="brand-mark"><img src={portrait} alt="" /></span><span>ANDREA JANELA SOLIVEN</span></div><p>Executive Unit Manager · Exclusive Level Financial Advisor<br />Pru Life UK</p><p>Helping Filipino families build clear, practical protection plans for the people and goals that matter most.</p></div>
        <div className="footer-column"><strong>Quick links</strong><div className="footer-links"><Link to="/about">About Andrea</Link><Link to="/assessment">Free Assessment</Link><Link to="/career">Career</Link><Link to="/faq">FAQ</Link></div></div>
        <div className="footer-column"><strong>Get in touch</strong><div className="footer-links"><Link to="/contact">Send an inquiry</Link><a href="https://m.me/engrandeng/" target="_blank" rel="noreferrer">Facebook Messenger</a><Link to="/book">Book a call</Link></div></div>
        <div className="footer-legal"><p className="fine-print">This website is for general information only. Product features, eligibility, and benefits are subject to the applicable policy contract and a proper needs analysis. No website estimate is a quotation or personal recommendation.</p><p>© {new Date().getFullYear()} Andrea Janela Soliven, ECE. All rights reserved. · <Link to="/privacy-policy">Privacy Policy</Link></p></div>
      </footer>
    </>
  )
}
