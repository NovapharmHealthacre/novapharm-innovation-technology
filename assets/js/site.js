document.documentElement.classList.add('nav-ready');

const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('[data-site-nav]');

function closeNavigation() {
  if (!navToggle || !siteNav) return;
  navToggle.setAttribute('aria-expanded', 'false');
  siteNav.dataset.open = 'false';
  document.body.classList.remove('nav-open');
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav.dataset.open = String(!isOpen);
    document.body.classList.toggle('nav-open', !isOpen);
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNavigation();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeNavigation();
  });
}

const enquiryForm = document.querySelector('[data-enquiry-form]');

if (enquiryForm) {
  const status = enquiryForm.querySelector('[data-form-status]');

  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!enquiryForm.reportValidity()) return;

    const formData = new FormData(enquiryForm);
    const firstName = String(formData.get('first_name') || '').trim();
    const lastName = String(formData.get('last_name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const enquiryType = String(formData.get('enquiry_type') || '').trim();
    const targetMarkets = String(formData.get('target_markets') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const subject = `NIT enquiry — ${enquiryType || 'Project discussion'} — ${company || `${firstName} ${lastName}`}`;
    const body = [
      'NOVAPHARM INNOVATION TECHNOLOGY — PROJECT ENQUIRY',
      '',
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Company: ${company || 'Not provided'}`,
      `Enquiry type: ${enquiryType || 'Not provided'}`,
      `Target markets: ${targetMarkets || 'Not provided'}`,
      '',
      'Project summary:',
      message,
      '',
      'Submitted from nit.novapharmhealthcare.com'
    ].join('\n');

    const mailto = `mailto:bd@novapharmhealthcare.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (status) {
      status.textContent = 'Your email application is opening with the project brief prepared. Please review and send the email to complete your enquiry.';
    }

    window.location.href = mailto;
  });
}

const year = document.querySelector('[data-current-year]');
if (year) year.textContent = String(new Date().getFullYear());
