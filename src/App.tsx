import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { bookingUrl } from './SiteLayout'
import './App.css'

const affiliations = ['PRU LIFE UK', 'eastspring investments', 'PRUDENTIAL', 'M&G Investments', 'JACKSON', 'ATRAM']
const uploadedCareerAlbumImages = Object.entries(import.meta.glob('./assets/career-album/*', { eager: true, query: '?url', import: 'default' }))
  .filter(([path]) => /\.(avif|gif|jpe?g|png|webp)$/i.test(path))
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath))
  .map(([, image]) => image as string)
const careerAlbumImages = uploadedCareerAlbumImages
const careerAlbumStories = [
  { eyebrow: 'YOUR PEOPLE. YOUR PURPOSE.', title: 'Turn conversations into impact.', tag: 'MAKE A DIFFERENCE' },
  { eyebrow: 'GROW WITH A REAL TEAM', title: 'Ambition looks better together.', tag: 'TEAM ENERGY' },
  { eyebrow: 'LEARN. LEAD. LEVEL UP.', title: 'Build skills that move with you.', tag: 'CAREER GROWTH' },
  { eyebrow: 'WORK WITH MEANING', title: 'Create a career that feels like yours.', tag: 'OWN YOUR FUTURE' },
  { eyebrow: 'BIG GOALS WELCOME', title: 'Your next bold move starts here.', tag: 'GO FOR MORE' },
]

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function PesoInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const formattedValue = new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 }).format(value)

  return (
    <span className="currency-input">
      <span aria-hidden="true">₱</span>
      <input
        type="text"
        inputMode="numeric"
        value={formattedValue}
        onFocus={(event) => event.currentTarget.select()}
        onChange={(event) => {
          const digits = event.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
          onChange(Number(digits) || 0)
        }}
      />
    </span>
  )
}

const pesos = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })

function App() {
  const [calculator, setCalculator] = useState<'emergency' | 'savings' | 'retirement' | 'investment' | 'estate'>('emergency')
  const [isSampleReportOpen, setIsSampleReportOpen] = useState(false)
  const [isCareerOpportunityOpen, setIsCareerOpportunityOpen] = useState(false)
  const [careerAlbumIndex, setCareerAlbumIndex] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(30000)
  const [fundMonths, setFundMonths] = useState(6)
  const [goal, setGoal] = useState(250000)
  const [goalMonths, setGoalMonths] = useState(24)
  const [startingAmount, setStartingAmount] = useState(0)
  const [interestRate, setInterestRate] = useState(3)
    const [currentAge, setCurrentAge] = useState(30)
    const [retirementAge, setRetirementAge] = useState(60)
    const [currentRetirementSavings, setCurrentRetirementSavings] = useState(0)
    const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState(50000)
  const [retirementYears, setRetirementYears] = useState(20)
    const [expectedInflation, setExpectedInflation] = useState(3)
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [investmentYears, setInvestmentYears] = useState(10)
  const [investmentReturn, setInvestmentReturn] = useState(6)
  const [totalAssets, setTotalAssets] = useState(5000000)
  const [estateTaxRate, setEstateTaxRate] = useState(6)

  const monthlyRate = interestRate / 100 / 12
  const savingsContribution = monthlyRate === 0
    ? (goal - startingAmount) / goalMonths
    : Math.max(0, (goal - startingAmount * Math.pow(1 + monthlyRate, goalMonths)) * monthlyRate / (Math.pow(1 + monthlyRate, goalMonths) - 1))
  const emergencyTarget = monthlyExpenses * fundMonths
  const monthlyReturn = investmentReturn / 100 / 12
  const investmentFuture = startingAmount * Math.pow(1 + monthlyReturn, investmentYears * 12)
    + monthlyInvestment * ((Math.pow(1 + monthlyReturn, investmentYears * 12) - 1) / monthlyReturn)
    const yearsToRetire = Math.max(0, retirementAge - currentAge)
    const retirementMonths = yearsToRetire * 12
    const retirementMonthlyReturn = investmentReturn / 100 / 12
    const desiredIncomeAtRetirement = desiredMonthlyIncome * Math.pow(1 + expectedInflation / 100, yearsToRetire)
    const retirementTarget = desiredIncomeAtRetirement * 12 * retirementYears
    const retirementProjection = retirementMonthlyReturn === 0
      ? currentRetirementSavings + monthlyInvestment * retirementMonths
      : currentRetirementSavings * Math.pow(1 + retirementMonthlyReturn, retirementMonths)
        + monthlyInvestment * ((Math.pow(1 + retirementMonthlyReturn, retirementMonths) - 1) / retirementMonthlyReturn)
    const retirementShortfall = Math.max(0, retirementTarget - retirementProjection)
    const targetFunded = retirementTarget === 0 ? 0 : Math.min(100, (retirementProjection / retirementTarget) * 100)
    const monthlyContributionNeeded = retirementMonths === 0 || retirementShortfall === 0 ? 0 : retirementMonthlyReturn === 0
      ? retirementShortfall / retirementMonths
      : Math.max(0, (retirementTarget - currentRetirementSavings * Math.pow(1 + retirementMonthlyReturn, retirementMonths)) * retirementMonthlyReturn / (Math.pow(1 + retirementMonthlyReturn, retirementMonths) - 1))
    const requiredLiquidMoney = totalAssets * (estateTaxRate / 100)
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible')
          else entry.target.classList.remove('is-visible')
        })
      },
      { threshold: 0.34 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (careerAlbumImages.length === 0) return

    const timer = window.setInterval(() => {
      setCareerAlbumIndex((index) => (index + 1) % careerAlbumImages.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [careerAlbumIndex])

  const showNextCareerPhoto = () => {
    if (careerAlbumImages.length < 2) return
    setCareerAlbumIndex((index) => (index + 1) % careerAlbumImages.length)
  }

  return (
    <main className="home-page">
      <section className="hero" id="home">
    <div className="hero-media" aria-hidden="true">
      <span className="hero-image hero-image-one" />
      <span className="hero-image hero-image-two" />
      <span className="hero-image hero-image-three" />
    </div>
        <div className="hero-main">
          <div className="hero-content reveal reveal-up">
            <p className="eyebrow">LICENSED FINANCIAL ADVISOR · PHILIPPINES</p>
            <h1>Know what&apos;s worth<br /><em>protecting next.</em></h1>
            <p className="hero-copy"><strong>Clear answers. Practical next steps.</strong> I&apos;m Andrea Janela Soliven, helping Filipino families, professionals, business owners, and OFWs make sense of protection, savings, and long-term goals—at a pace that respects your priorities and budget.</p>
            <div className="hero-actions">
              <Link className="button button-light" to="/assessment">Take free assessment <Arrow /></Link>
              <Link className="text-link" to="/book">Book a consultation <span>→</span></Link>
            </div>
            <dl className="hero-stats" aria-label="Andrea's professional milestones">
              <div><dt>170+</dt><dd>Clients</dd></div>
              <div><dt>₱100M+</dt><dd>Protection coverage secured</dd></div>
              <div><dt>60+</dt><dd>Financial advisors led</dd></div>
            </dl>
          </div>
          <aside className="hero-report-preview reveal reveal-up delay-2" aria-label="Sample assessment report">
            <div className="report-preview-header">
              <p className="report-preview-label">SAMPLE ASSESSMENT REPORT</p>
              <span>2 MINUTES</span>
            </div>
            <h2>Protection Snapshot</h2>
            <p>See the areas your plan may need to cover.</p>
            <div className="report-preview-gap"><span>Major gap</span><strong>HMO protection only</strong></div>
            <ul className="report-preview-lines">
              <li><span><b>Income protection</b><small>10 years of family support</small></span><strong>₱7.2M</strong></li>
              <li><span><b>Critical illness fund</b><small>cancer, stroke, heart</small></span><strong>₱1.5M</strong></li>
              <li><span><b>Emergency fund</b><small>six months income</small></span><strong>₱900K</strong></li>
            </ul>
            <div className="report-preview-total"><span>Estimated protection gap</span><strong>₱9.6M</strong></div>
            <button type="button" onClick={() => setIsSampleReportOpen(true)}>Open sample breakdown <Arrow /></button>
          </aside>
        </div>

        <div className="hero-bottom reveal reveal-fade delay-3">
          <span>BICOL • METRO MANILA • PHILIPPINES</span>
          <span className="scroll-cue">SCROLL TO EXPLORE <i /></span>
          <span>EST. 2020</span>
        </div>
      </section>

      <section className="home-paths" id="why-us">
        <div className="home-paths-heading reveal reveal-up">
          <p className="section-label">01 / START WITH CLARITY</p>
          <h2>Big goals deserve<br />a <em>clearer plan.</em></h2>
          <p>Start with a short assessment, then choose the conversation that fits where you are today.</p>
        </div>
        <div className="home-path-grid reveal reveal-up delay-1">
          <article>
            <span>01 / FOR CLIENTS</span>
            <h3>Protect what<br />matters most.</h3>
            <p>Get an educational snapshot of the areas you may want to explore—from income protection to long-term preparation.</p>
            <ul><li>Free planning assessment</li><li>Budget-aware next steps</li><li>A personal conversation with Andrea</li></ul>
            <Link to="/assessment">Start free assessment <Arrow /></Link>
          </article>
          <article>
            <span>02 / FOR FUTURE ADVISORS</span>
            <h3>Lead a career<br />with purpose.</h3>
            <p>Explore the financial-advisor path with mentorship, ongoing learning, and a community built around helping people move forward.</p>
            <ul><li>Mentorship from day one</li><li>Training and team support</li><li>A career built around impact</li></ul>
            <Link to="/career">Explore the career path <Arrow /></Link>
          </article>
        </div>
      </section>

      <section className="planner" id="calculator">
        <div className="planner-heading reveal reveal-up">
          <p className="section-label">02 / PLAN WITH PURPOSE</p>
          <h2>Make your next<br /><em>move measurable.</em></h2>
          <p>Explore practical estimates for your goals. Adjust the numbers to make the plan your own.</p>
        </div>
        <div className="calculator-card reveal reveal-up delay-1">
          <div className="calculator-tabs" role="tablist" aria-label="Financial calculators">
            {([['emergency', 'Emergency fund'], ['savings', 'Savings goal'], ['retirement', 'Retirement'], ['investment', 'Interest & investments'], ['estate', 'Estate planning']] as const).map(([key, label]) => (
              <button className={calculator === key ? 'active' : ''} key={key} onClick={() => setCalculator(key)} role="tab" aria-selected={calculator === key}>{label}</button>
            ))}
          </div>
          {calculator === 'emergency' && <div className="calculator-body">
            <label>Monthly essential expenses <PesoInput value={monthlyExpenses} onChange={setMonthlyExpenses} /></label>
            <label>Months of coverage <input type="number" min="1" max="24" value={fundMonths} onChange={(event) => setFundMonths(Number(event.target.value))} /></label>
            <div className="calculation-result"><span>Your emergency-fund target</span><strong>{pesos.format(emergencyTarget)}</strong><small>A common starting range is 3–6 months of essential expenses.</small></div>
          </div>}
          {calculator === 'savings' && <div className="calculator-body">
            <label>Your savings goal <PesoInput value={goal} onChange={setGoal} /></label>
            <label>Starting amount <PesoInput value={startingAmount} onChange={setStartingAmount} /></label>
            <label>Timeline (months) <input type="number" min="1" value={goalMonths} onChange={(event) => setGoalMonths(Number(event.target.value))} /></label>
            <label>Annual interest rate (%) <input type="number" min="0" step="0.1" value={interestRate} onChange={(event) => setInterestRate(Number(event.target.value))} /></label>
            <div className="calculation-result"><span>Estimated monthly contribution</span><strong>{pesos.format(savingsContribution)}</strong><small>Assumes monthly compounding and deposits at month-end.</small></div>
          </div>}
          {calculator === 'retirement' && <div className="calculator-body retirement-calculator">
            <div className="calculator-group">Retirement plan</div>
            <label>Current age <input type="number" min="18" max="100" value={currentAge} onChange={(event) => setCurrentAge(Number(event.target.value))} /></label>
            <label>Planned retirement age <input type="number" min={currentAge} max="100" value={retirementAge} onChange={(event) => setRetirementAge(Number(event.target.value))} /></label>
            <label>Current retirement savings <PesoInput value={currentRetirementSavings} onChange={setCurrentRetirementSavings} /></label>
            <label>Monthly contribution <PesoInput value={monthlyInvestment} onChange={setMonthlyInvestment} /></label>
            <label>Expected annual return (%) <input type="number" min="0" step="0.1" value={investmentReturn} onChange={(event) => setInvestmentReturn(Number(event.target.value))} /></label>
            <div className="calculator-group">Retirement target</div>
            <label>Desired monthly income (today’s money) <PesoInput value={desiredMonthlyIncome} onChange={setDesiredMonthlyIncome} /></label>
            <label>Years in retirement <input type="number" min="1" value={retirementYears} onChange={(event) => setRetirementYears(Number(event.target.value))} /></label>
            <label>Expected inflation (%) <input type="number" min="0" step="0.1" value={expectedInflation} onChange={(event) => setExpectedInflation(Number(event.target.value))} /></label>
            <div className="calculation-result retirement-result"><span>Projected retirement savings</span><strong>{pesos.format(retirementProjection)}</strong><div className="retirement-breakdown"><span>Estimated target fund <b>{pesos.format(retirementTarget)}</b></span><span>Target funded <b>{targetFunded.toFixed(1)}%</b></span><span>Projected shortfall <b>{pesos.format(retirementShortfall)}</b></span><span>Monthly contribution needed <b>{pesos.format(monthlyContributionNeeded)}</b></span><span>Desired income at retirement / month <b>{pesos.format(desiredIncomeAtRetirement)}</b></span></div><small>Based on a {yearsToRetire}-year saving period. This is an illustration, not a guaranteed outcome.</small></div>
          </div>}
          {calculator === 'investment' && <div className="calculator-body">
            <label>Starting amount <PesoInput value={startingAmount} onChange={setStartingAmount} /></label>
            <label>Monthly contribution <PesoInput value={monthlyInvestment} onChange={setMonthlyInvestment} /></label>
            <label>Investment period (years) <input type="number" min="1" value={investmentYears} onChange={(event) => setInvestmentYears(Number(event.target.value))} /></label>
            <label>Assumed annual return (%) <input type="number" min="0" step="0.1" value={investmentReturn} onChange={(event) => setInvestmentReturn(Number(event.target.value))} /></label>
            <div className="calculation-result"><span>Illustrative future value</span><strong>{pesos.format(investmentFuture)}</strong><small>Assumes monthly compounding. Investment returns are not guaranteed.</small></div>
          </div>}
          {calculator === 'estate' && <div className="calculator-body">
            <div className="calculator-group">Estate liquidity estimate</div>
            <label>Total value of assets <PesoInput value={totalAssets} onChange={setTotalAssets} /></label>
            <label>Estate tax (in PH) (%) <input type="number" min="0" max="100" step="0.1" value={estateTaxRate} onFocus={(event) => event.currentTarget.select()} onChange={(event) => setEstateTaxRate(Number(event.target.value) || 0)} /></label>
            <div className="calculation-result"><span>Required liquid money</span><strong>{pesos.format(requiredLiquidMoney)}</strong><small>Based on the entered estate-tax rate. The Philippine estate tax rate is shown as 6% by default; taxable net estate, deductions, exemptions, deadlines, and other obligations may affect the actual amount due.</small></div>
          </div>}
          <p className="calculator-disclaimer">For education only—not financial, investment, tax, or insurance advice. Actual rates, costs, taxes, inflation, and investment performance will vary.</p>
        </div>
      </section>

      <section className="company-value" id="solutions">
        <div className="company-value-copy reveal reveal-up">
          <p className="section-label">03 / PROTECTION WITH PURPOSE</p>
          <p className="company-kicker">PROUDLY CONNECTED WITH PRU LIFE UK</p>
          <h2>Plans for the life<br />you are <em>building.</em></h2>
          <p>Every family&apos;s priorities are different. The right conversation starts with the life you want to protect, then explores solutions that may support your goals.</p>
          <a className="text-link" href="https://www.prulifeuk.com.ph/" target="_blank" rel="noreferrer">Learn about Pru Life UK <Arrow /></a>
        </div>
        <div className="solution-grid reveal reveal-up delay-1">
          <article><span>01</span><h3>Life protection</h3><p>Help prepare the people you love for an unexpected loss of income.</p></article>
          <article><span>02</span><h3>Health protection</h3><p>Plan ahead for health-related financial pressures and recovery.</p></article>
          <article><span>03</span><h3>Goal-based savings</h3><p>Build disciplined preparation for milestones that matter to you.</p></article>
          <article><span>04</span><h3>Retirement & legacy</h3><p>Explore long-term preparation for the life and legacy you envision.</p></article>
        </div>
        <p className="company-disclosure reveal reveal-fade delay-2">Pru Life UK offers a range of insurance and investment-linked solutions. Product availability, features, benefits, costs, eligibility, and investment performance vary and are subject to the applicable policy contract and a proper needs analysis.</p>
      </section>

      <section className="affiliations" aria-label="Licensed affiliations and fund partners">
        <p className="section-label">LICENSED AFFILIATIONS &amp; FUND PARTNERS</p>
        <div className="affiliation-marquee" aria-label="Pru Life UK, Eastspring Investments, Prudential, M&G Investments, Jackson, and ATRAM">
          <div className="affiliation-track">
            {[...affiliations, ...affiliations].map((name, index) => <span key={`${name}-${index}`}>{name}</span>)}
          </div>
        </div>
        <p className="affiliation-note">Affiliations and fund availability are subject to applicable product terms, distribution arrangements, and client suitability requirements.</p>
      </section>

      <section className="career-spotlight" id="team">
        <div className="career-spotlight-copy reveal reveal-up">
          <p className="section-label">04 / BUILD A CAREER WITH PURPOSE</p>
          <h2>Big dreams.<br /><em>Real impact.</em></h2>
          <p>Are you purpose-driven, ambitious, and ready to help people make meaningful moves for their future? Explore the financial-advisor path with a team that values growth, service, and shared progress.</p>
          <div className="career-spotlight-points">
            <span>MENTORSHIP &amp; LEARNING</span>
            <span>PEOPLE-FIRST WORK</span>
            <span>TEAM EXPERIENCES</span>
          </div>
          <button className="button button-dark career-opportunity-trigger" type="button" onClick={() => setIsCareerOpportunityOpen(true)}>Explore the career path <Arrow /></button>
          <p className="career-spotlight-disclosure">Career opportunities, earnings, incentives, and travel experiences vary based on role, eligibility, performance, and applicable program terms. Nothing is guaranteed.</p>
        </div>
        <div className="career-album reveal reveal-scale" aria-label="Moments from Andrea's advisor community">
          <div className="career-album-topline"><span>ADVISOR LIFE / UNFILTERED</span><b>{String(careerAlbumIndex + 1).padStart(2, '0')} / {String(Math.max(careerAlbumImages.length, 1)).padStart(2, '0')}</b></div>
          <button className="career-album-deck" type="button" onClick={showNextCareerPhoto} aria-label="Show next advisor community photo" aria-live="polite">
            {careerAlbumImages.map((image, index) => {
              const deckPosition = (index - careerAlbumIndex + careerAlbumImages.length) % careerAlbumImages.length

              return (
                <div
                  className={`career-album-image deck-${Math.min(deckPosition, 3)} ${deckPosition === 0 ? 'is-active' : ''}`}
                  key={image}
                  style={{ '--deck-position': deckPosition } as CSSProperties}
                  aria-hidden={deckPosition !== 0}
                >
                  <img src={image} alt={deckPosition === 0 ? 'Advisor community moment' : ''} />
                </div>
              )
            })}
          </button>
          <div className="career-album-caption">
            <span>{careerAlbumStories[careerAlbumIndex % careerAlbumStories.length].eyebrow}</span>
            <strong>{careerAlbumStories[careerAlbumIndex % careerAlbumStories.length].title}</strong>
            <small>{careerAlbumStories[careerAlbumIndex % careerAlbumStories.length].tag}</small>
          </div>
          <div className="career-album-progress" aria-hidden="true"><i style={{ width: `${((careerAlbumIndex + 1) / Math.max(careerAlbumImages.length, 1)) * 100}%` }} /></div>
        </div>
      </section>

      <section className="credibility-section">
        <div className="reveal reveal-up">
          <p className="section-label">CREDENTIALS & COMMITMENT</p>
          <h2>Advice backed by<br /><em>experience.</em></h2>
          <p>Andrea brings six years of financial-advisory experience, with a focus on clear conversations and preparation that reflects each household&apos;s priorities.</p>
          <a className="button button-dark" href={bookingUrl} target="_blank" rel="noreferrer">Book a consultation <Arrow /></a>
        </div>
        <dl className="credential-list reveal reveal-up delay-1">
          <div><dt>LICENSE NO.</dt><dd>70099885</dd></div>
          <div><dt>PROFESSIONAL ROLES</dt><dd>Executive Unit Manager · Exclusive Level Financial Consultant · Certified Investment Advisor</dd></div>
          <div><dt>RECOGNITION</dt><dd>Multi-Awarded Financial Advisor · GAMA FLA Gold Level</dd></div>
          <div><dt>EXPERIENCE</dt><dd>6 years of service</dd></div>
        </dl>
      </section>

      <section className="recruit" id="protection">
        <p className="section-label reveal reveal-fade">05 / PROTECT WHAT MATTERS</p>
        <div className="recruit-grid reveal reveal-up delay-1">
          <h2>The people you love<br />deserve a <em>plan.</em></h2>
          <div>
            <p className="large-copy">Make space for the moments ahead with protection and planning shaped around the people who count on you.</p>
            <ul>
              <li>Protection for your family <span>01</span></li>
              <li>Preparation for life&apos;s changes <span>02</span></li>
              <li>A plan for your long-term goals <span>03</span></li>
            </ul>
            <Link className="text-link dark" to="/contact">Start a planning conversation <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="connect" id="connect">
        <p className="section-label reveal reveal-fade">06 / START HERE</p>
        <h2 className="reveal reveal-up delay-1">What will you<br /><em>move toward?</em></h2>
        <div className="connect-options reveal reveal-up delay-2">
          <Link to="/contact"><span>I want to protect my future</span> <Arrow /></Link>
          <Link to="/contact"><span>I want to plan for my family</span> <Arrow /></Link>
        </div>
      </section>

      {isSampleReportOpen && <div className="report-modal-backdrop" role="presentation" onMouseDown={() => setIsSampleReportOpen(false)}>
        <section className="sample-report-modal" role="dialog" aria-modal="true" aria-labelledby="sample-report-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="modal-close" type="button" onClick={() => setIsSampleReportOpen(false)} aria-label="Close sample report">×</button>
          <p className="report-preview-label">SAMPLE ASSESSMENT REPORT</p>
          <h2 id="sample-report-title">Protection Gap<br /><em>Snapshot</em></h2>
          <p className="sample-report-subtitle">See the areas your plan may need to cover.</p>
          <p className="sample-report-meta">Illustrated from six quick answers · about 2 minutes</p>
          <div className="sample-major-gap"><span>Major gap</span><strong>HMO protection only</strong></div>
          <div className="sample-report-lines">
            <div><span><b>Income protection</b><small>10 years of family support</small></span><strong>₱7.2M</strong></div>
            <div><span><b>Critical illness fund</b><small>cancer, stroke, heart</small></span><strong>₱1.5M</strong></div>
            <div><span><b>Emergency fund</b><small>six months income</small></span><strong>₱900K</strong></div>
            <div className="sample-report-total"><span><b>Estimated protection gap</b><small>Illustrative planning range</small></span><strong>₱9.6M</strong></div>
          </div>
          <p className="sample-report-budget">A ₱3–5K monthly budget may begin addressing part of this range. Discuss your options in a free Clarity Call.</p>
          <Link className="button button-dark" to="/assessment" onClick={() => setIsSampleReportOpen(false)}>Unlock your free assessment <Arrow /></Link>
          <p className="sample-report-disclaimer">Sample illustration only. A personal recommendation requires a proper needs analysis and discussion of available solutions.</p>
        </section>
      </div>}

      {isCareerOpportunityOpen && <div className="report-modal-backdrop career-modal-backdrop" role="presentation" onMouseDown={() => setIsCareerOpportunityOpen(false)}>
        <section className="career-opportunity-modal" role="dialog" aria-modal="true" aria-labelledby="career-opportunity-title" onMouseDown={(event) => event.stopPropagation()}>
          <button className="modal-close" type="button" onClick={() => setIsCareerOpportunityOpen(false)} aria-label="Close career opportunity">×</button>
          <p className="report-preview-label">CAREER OPPORTUNITY</p>
          <h2 id="career-opportunity-title">We&apos;re looking for future<br /><em>financial advisors.</em></h2>
          <p className="career-opportunity-intro">Looking for a career where you can earn, grow, travel, and make an impact—while building something of your own? You might be who we&apos;re looking for.</p>
          <div className="career-opportunity-grid">
            <div>
              <h3>Who can apply?</h3>
              <ul>
                <li>Bachelor&apos;s degree holder</li>
                <li>21–40 years old</li>
                <li>Coachable, self-driven, and of good character</li>
                <li>Can commit at least 3 hours per day</li>
                <li>Willing to transition to full-time after 6 months</li>
                <li>Sales or banking experience is a plus</li>
                <li>Fresh graduates are welcome to apply</li>
              </ul>
            </div>
            <div>
              <h3>What&apos;s in it for you?</h3>
              <ul>
                <li>₱15,000 monthly allowance</li>
                <li>Weekly commissions</li>
                <li>Monthly incentives and quarterly bonuses</li>
                <li>Travel incentives and recognition</li>
                <li>Supportive working environment and team culture</li>
                <li>Career growth and leadership opportunities</li>
              </ul>
            </div>
          </div>
          <p className="career-opportunity-closing">This is more than an extra source of income. It&apos;s an opportunity to build a long-term career and become a future leader.</p>
          <a className="button button-dark" href="mailto:plukandreajanelasoliven@gmail.com?subject=Future%20Financial%20Advisor%20Application">Send your CV <Arrow /></a>
          <p className="career-opportunity-disclosure">Allowance, commissions, incentives, bonuses, travel programs, career progression, eligibility, and outcomes are subject to role requirements, performance, qualification, and applicable program terms. They are not guaranteed.</p>
        </section>
      </div>}
    </main>
  )
}

export default App
