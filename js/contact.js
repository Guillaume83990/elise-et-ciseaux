/* ============================================================
   ÉLISE & CISEAUX — contact.js
   Onglets formulaire, validation, FAQ accordion, jour courant
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────────────────────────
       JOUR COURANT dans les horaires
    ──────────────────────────────────────────────────────────── */
    const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
    const today = days[new Date().getDay()];
    const todayRow = document.querySelector(`.horaire-row[data-day="${today}"]`);
    if (todayRow) {
        todayRow.classList.add('horaire-row--today');
    }


    /* ────────────────────────────────────────────────────────────
       ONGLETS (Message / Rendez-vous)
    ──────────────────────────────────────────────────────────── */
    const tabs = document.querySelectorAll('.form-tab');
    const rdvFields = document.querySelector('.rdv-fields');
    const formTitle = document.querySelector('.form-dynamic-title');
    const subjectField = document.querySelector('#subject');

    const titles = {
        message: 'Envoyez-nous<br><em>un message</em>',
        rdv: 'Demander<br><em>un rendez-vous</em>',
    };

    const subjects = {
        message: '',
        rdv: 'Demande de rendez-vous',
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const type = tab.getAttribute('data-tab');

            if (rdvFields) {
                rdvFields.classList.toggle('is-hidden', type !== 'rdv');
            }

            if (formTitle) {
                formTitle.innerHTML = titles[type] || titles.message;
            }

            if (subjectField && subjects[type] !== undefined) {
                subjectField.value = subjects[type];
            }
        });
    });


    /* ────────────────────────────────────────────────────────────
       VALIDATION FORMULAIRE
    ──────────────────────────────────────────────────────────── */
    const form = document.querySelector('.contact-form');
    const successMsg = document.querySelector('.form-success');

    if (!form) return;

    const rules = {
        nom: { required: true, minLength: 2 },
        prenom: { required: true, minLength: 2 },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        tel: { required: false, pattern: /^[\d\s\+\-\.]{7,20}$/ },
        message: { required: true, minLength: 10 },
        gdpr: { required: true, type: 'checkbox' },
    };

    const getError = (name, value, rule) => {
        if (rule.type === 'checkbox') {
            return !value ? 'Vous devez accepter la politique de confidentialité.' : '';
        }
        if (rule.required && !value.trim()) return 'Ce champ est requis.';
        if (rule.minLength && value.trim().length < rule.minLength) {
            return `Minimum ${rule.minLength} caractères requis.`;
        }
        if (rule.pattern && value.trim() && !rule.pattern.test(value.trim())) {
            return 'Format invalide.';
        }
        return '';
    };

    const showError = (name, msg) => {
        const field = form.querySelector(`[name="${name}"]`);
        const errEl = form.querySelector(`[data-error="${name}"]`);
        if (field) field.classList.toggle('error', !!msg);
        if (errEl) {
            errEl.textContent = msg;
            errEl.classList.toggle('is-visible', !!msg);
        }
    };

    /* Validation en temps réel au blur */
    Object.keys(rules).forEach(name => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;
        field.addEventListener('blur', () => {
            const value = rules[name].type === 'checkbox' ? field.checked : field.value;
            showError(name, getError(name, value, rules[name]));
        });
        /* Effacer l'erreur dès que l'utilisateur retape */
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                showError(name, '');
            }
        });
    });

    /* Soumission */
    form.addEventListener('submit', e => {
        e.preventDefault();

        let isValid = true;

        Object.keys(rules).forEach(name => {
            const field = form.querySelector(`[name="${name}"]`);
            if (!field) return;
            const value = rules[name].type === 'checkbox' ? field.checked : field.value;
            const msg = getError(name, value, rules[name]);
            showError(name, msg);
            if (msg) isValid = false;
        });

        if (!isValid) return;

        /* Simulation envoi (à remplacer par fetch vers votre backend) */
        const btn = form.querySelector('[type="submit"]');
        btn.textContent = 'Envoi en cours…';
        btn.disabled = true;

        setTimeout(() => {
            form.style.display = 'none';
            if (successMsg) successMsg.classList.add('is-visible');
        }, 1200);
    });


    /* ────────────────────────────────────────────────────────────
       FAQ ACCORDION
    ──────────────────────────────────────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            /* Ferme tous les autres */
            faqItems.forEach(i => i.classList.remove('is-open'));

            /* Ouvre celui-ci sauf s'il était déjà ouvert */
            if (!isOpen) item.classList.add('is-open');
        });
    });

});