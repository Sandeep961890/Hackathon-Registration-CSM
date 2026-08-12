const soloRegistrationBtn = document.getElementById('soloRegistrationBtn');
const duoRegistrationBtn = document.getElementById('duoRegistrationBtn');
const teamRegistrationBtn = document.getElementById('teamRegistrationBtn');
const soloPanel = document.getElementById('soloPanel');
const duoPanel = document.getElementById('duoPanel');
const teamPanel = document.getElementById('teamPanel');
const teamSizeSelect = document.getElementById('teamSize');
const teamMembersContainer = document.getElementById('teamMembersContainer');
const soloForm = document.getElementById('soloForm');
const duoForm = document.getElementById('duoForm');
const teamForm = document.getElementById('teamForm');
const soloStatus = document.getElementById('soloStatus');
const duoStatus = document.getElementById('duoStatus');
const teamStatus = document.getElementById('teamStatus');

const createMemberField = (index) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'team-member-group';
  wrapper.innerHTML = `
    <h4>Member ${index}</h4>
    <label class="field">
      <span class="field__label">Name</span>
      <input id="memberName${index}" name="memberName${index}" type="text" class="field__input" required>
    </label>
    <label class="field">
      <span class="field__label">Mobile Number</span>
      <input id="memberMobile${index}" name="memberMobile${index}" type="tel" class="field__input" required>
    </label>
    <label class="field">
      <span class="field__label">Roll Number</span>
      <input id="memberRollNumber${index}" name="memberRollNumber${index}" type="text" class="field__input" required>
    </label>
    <label class="field">
      <span class="field__label">Branch</span>
      <input id="memberBranch${index}" name="memberBranch${index}" type="text" class="field__input" required>
    </label>
    <label class="field">
      <span class="field__label">Year</span>
      <select id="memberYear${index}" name="memberYear${index}" class="field__input" required>
        <option value="">Select year</option>
        <option value="1st Year">1st Year</option>
        <option value="2nd Year">2nd Year</option>
        <option value="3rd Year">3rd Year</option>
        <option value="4th Year">4th Year</option>
      </select>
    </label>
    <label class="field">
      <span class="field__label">Email</span>
      <input id="memberEmail${index}" name="memberEmail${index}" type="email" class="field__input" required>
    </label>
    <label class="field">
      <span class="field__label">College</span>
      <input id="memberCollege${index}" name="memberCollege${index}" type="text" class="field__input" required>
    </label>
  `;
  return wrapper;
};

const updateTeamMembers = () => {
  if (!teamMembersContainer || !teamSizeSelect) return;
  const size = Number(teamSizeSelect.value);
  const memberCount = Math.max(size - 1, 0);
  teamMembersContainer.innerHTML = '';

  for (let i = 1; i <= memberCount; i += 1) {
    teamMembersContainer.appendChild(createMemberField(i));
  }
};

const setTab = (activeButton, activePanel) => {
  const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
  const panels = Array.from(document.querySelectorAll('.registration-panel'));

  tabButtons.forEach((btn) => {
    btn.classList.remove('tab-button--active');
    btn.setAttribute('aria-selected', 'false');
  });

  panels.forEach((panel) => {
    panel.classList.remove('registration-panel--active');
    panel.setAttribute('hidden', '');
  });

  if (activeButton) {
    activeButton.classList.add('tab-button--active');
    activeButton.setAttribute('aria-selected', 'true');
  }

  if (activePanel) {
    activePanel.classList.add('registration-panel--active');
    activePanel.removeAttribute('hidden');
  }
};

const getLabelText = (field) => {
  const label = field.closest('.field')?.querySelector('.field__label');
  return label ? label.textContent.trim() : 'This field';
};

const createErrorElement = (message) => {
  const error = document.createElement('div');
  error.className = 'form-error';
  error.textContent = message;
  return error;
};

const clearFieldError = (field) => {
  field.classList.remove('input--error');
  const next = field.nextElementSibling;
  if (next?.classList.contains('form-error')) {
    next.remove();
  }
};

const setFieldError = (field, message) => {
  clearFieldError(field);
  field.classList.add('input--error');
  const error = createErrorElement(message);
  field.insertAdjacentElement('afterend', error);
};

const clearAllErrors = (form) => {
  form.querySelectorAll('.form-error').forEach((node) => node.remove());
  form.querySelectorAll('.field__input.input--error').forEach((input) => input.classList.remove('input--error'));
};

const isPhoneValid = (value) => /^[0-9]{10}$/.test(value.trim());

const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const validateField = (field) => {
  const value = field.value.trim();
  const label = getLabelText(field);

  if (!value) {
    return `${label} is required.`;
  }

  if (field.type === 'email' || /email/i.test(field.name)) {
    if (!isEmailValid(value)) {
      return 'Please enter a valid email address.';
    }
  }

  if (field.type === 'tel' || /mobile/i.test(field.name)) {
    if (!isPhoneValid(value)) {
      return 'Phone number must contain exactly 10 digits.';
    }
  }

  return '';
};

const validateForm = (form) => {
  if (!form) return false;
  clearAllErrors(form);
  const inputs = Array.from(form.querySelectorAll('.field__input'));
  let valid = true;

  inputs.forEach((input) => {
    const error = validateField(input);
    if (error) {
      valid = false;
      setFieldError(input, error);
    }
  });

  return valid;
};

const setButtonState = (button, disabled, text) => {
  if (!button) return;
  if (disabled) {
    button.disabled = true;
    button.dataset.originalText = button.dataset.originalText || button.textContent;
    button.textContent = text;
    button.classList.add('button--disabled');
  } else {
    button.disabled = false;
    button.textContent = text || button.dataset.originalText || button.textContent;
    button.classList.remove('button--disabled');
  }
};

const createLoadingOverlay = () => {
  const overlay = document.createElement('div');
  overlay.id = 'registrationLoadingOverlay';
  overlay.className = 'registration-loading-overlay';
  overlay.innerHTML = `
    <div class="registration-loading-shell" role="status" aria-live="polite">
      <div class="premium-spinner" aria-hidden="true"></div>
      <p class="registration-loading-text">Processing Registration...</p>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
};

const getLoadingOverlay = () => {
  return document.getElementById('registrationLoadingOverlay') || createLoadingOverlay();
};

const showLoading = () => {
  const overlay = getLoadingOverlay();
  overlay.style.display = 'flex';
  document.body.classList.add('loading-active');
};

const hideLoading = () => {
  const overlay = document.getElementById('registrationLoadingOverlay');
  if (!overlay) return;
  overlay.style.display = 'none';
  document.body.classList.remove('loading-active');
};

let lastSubmittedForm = null;

const createSuccessOverlay = () => {
  const overlay = document.createElement('div');
  overlay.id = 'registrationSuccessOverlay';
  overlay.className = 'registration-success-overlay';
  overlay.innerHTML = `
    <div class="registration-success-card" role="dialog" aria-labelledby="successTitle" aria-live="polite">
      <div class="success-icon-shell" aria-hidden="true">
        <div class="success-icon">✓</div>
      </div>
      <h2 id="successTitle">REGISTRATION SUCCESSFUL!</h2>
      <p class="success-message">Your registration has been successfully submitted.</p>
      <p class="success-subtitle">All the very best for AI HackSprint 1.0!</p>
      <p class="success-caption">Keep innovating. Keep building. Keep creating.</p>
      <p class="success-note">Get ready to solve, innovate and make an impact!</p>
      <button type="button" class="button button--primary registration-success-action">REGISTER ANOTHER TEAM</button>
    </div>
  `;

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      hideSuccessScreen();
    }
  });

  overlay.querySelector('.registration-success-action')?.addEventListener('click', hideSuccessScreen);

  document.body.appendChild(overlay);
  return overlay;
};

const getSuccessOverlay = () => {
  return document.getElementById('registrationSuccessOverlay') || createSuccessOverlay();
};

const showSuccessScreen = (form, message = '') => {
  lastSubmittedForm = form || null;
  const overlay = getSuccessOverlay();
  const messageElement = overlay.querySelector('.success-message');

  if (message && messageElement) {
    messageElement.textContent = message;
  } else if (messageElement) {
    messageElement.textContent = 'Your registration has been successfully submitted.';
  }

  overlay.style.display = 'flex';
  const activePanel = lastSubmittedForm?.closest('.registration-panel');
  if (activePanel) {
    activePanel.classList.add('registration-panel--success-hidden');
  }
};

const hideSuccessScreen = () => {
  const overlay = document.getElementById('registrationSuccessOverlay');
  if (!overlay) return;
  overlay.style.display = 'none';

  const messageElement = overlay.querySelector('.success-message');
  if (messageElement) {
    messageElement.textContent = 'Your registration has been successfully submitted.';
  }

  document.querySelectorAll('.registration-panel.registration-panel--success-hidden').forEach((panel) => {
    panel.classList.remove('registration-panel--success-hidden');
  });

  if (lastSubmittedForm) {
    const submitButton = lastSubmittedForm.querySelector('button[type="submit"]') || lastSubmittedForm.querySelector('button');
    setButtonState(submitButton, false, submitButton?.dataset?.originalText || submitButton?.textContent);
    clearAllErrors(lastSubmittedForm);
    clearStatus(lastSubmittedForm.querySelector('.form-status'));
    lastSubmittedForm.reset();
    if (lastSubmittedForm === teamForm && teamSizeSelect) {
      updateTeamMembers();
    }
  }

  lastSubmittedForm = null;
};

window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showSuccessScreen = showSuccessScreen;
window.hideSuccessScreen = hideSuccessScreen;

const setStatus = (container, message, type) => {
  if (!container) return;
  container.textContent = message;
  container.className = 'form-status';
  if (type) {
    container.classList.add(`form-status--${type}`);
  }
};

const clearStatus = (container) => {
  if (!container) return;
  container.textContent = '';
  container.className = 'form-status';
};

const getFormValues = (form) => {
  const values = {};
  new FormData(form).forEach((value, key) => {
    values[key] = value.trim();
  });
  return values;
};

const normalizePayloadAmount = (payload) => {
  if (payload?.amount) {
    payload.amount = payload.amount.replace(/[^0-9]/g, '');
  }
  return payload;
};

const buildTeamPayload = (form) => {
  const payload = normalizePayloadAmount(getFormValues(form));
  const teamSize = Number(form.teamSize?.value || 0);
  const memberCount = Math.max(teamSize - 1, 0);

  for (let i = 1; i <= memberCount; i += 1) {
    const memberNumber = i + 1;
    payload[`member${memberNumber}Name`] = form[`memberName${i}`]?.value.trim() || '';
    payload[`member${memberNumber}Mobile`] = form[`memberMobile${i}`]?.value.trim() || '';
    payload[`member${memberNumber}Branch`] = form[`memberBranch${i}`]?.value.trim() || '';
    payload[`member${memberNumber}Year`] = form[`memberYear${i}`]?.value.trim() || '';
    payload[`member${memberNumber}Email`] = form[`memberEmail${i}`]?.value.trim() || '';
    payload[`member${memberNumber}College`] = form[`memberCollege${i}`]?.value.trim() || '';
    payload[`member${memberNumber}RollNumber`] = form[`memberRollNumber${i}`]?.value.trim() || '';

    delete payload[`memberName${i}`];
    delete payload[`memberMobile${i}`];
    delete payload[`memberRollNumber${i}`];
    delete payload[`memberBranch${i}`];
    delete payload[`memberYear${i}`];
    delete payload[`memberEmail${i}`];
    delete payload[`memberCollege${i}`];
  }

  return payload;
};

const buildDuoPayload = (form) => normalizePayloadAmount(getFormValues(form));

const buildSoloPayload = (form) => normalizePayloadAmount(getFormValues(form));

const submitForm = async ({ form, statusElement, apiMethod, successMessage }) => {
  if (!form || !statusElement) return;

  const submitButton = form.querySelector('button[type="submit"]') || form.querySelector('button');
  const originalButtonText = submitButton?.textContent;

  clearAllErrors(form);

  if (!validateForm(form)) {
    setStatus(statusElement, 'Please fix the highlighted fields before submitting.', 'error');
    return;
  }

  showLoading();
  setButtonState(submitButton, true, 'SUBMITTING...');
  setStatus(statusElement, 'Processing registration...', '');

  const data = apiMethod === window.api.submitTeamRegistration
    ? buildTeamPayload(form)
    : apiMethod === window.api.submitDuoRegistration
      ? buildDuoPayload(form)
      : buildSoloPayload(form);

  let requestSucceeded = false;

  try {
    await apiMethod(data);
    requestSucceeded = true;
    hideLoading();
    showSuccessScreen(form, successMessage);
  } catch (error) {
    console.error('Registration submission failed:', error);
    hideLoading();
    setButtonState(submitButton, false, originalButtonText);
    setStatus(statusElement, error?.message || 'Unable to send registration. Please try again.', 'error');
  } finally {
    if (!requestSucceeded) {
      hideLoading();
    }
  }
};

if (soloRegistrationBtn && duoRegistrationBtn && teamRegistrationBtn && soloPanel && duoPanel && teamPanel) {
  soloRegistrationBtn.addEventListener('click', () => setTab(soloRegistrationBtn, soloPanel));
  duoRegistrationBtn.addEventListener('click', () => setTab(duoRegistrationBtn, duoPanel));
  teamRegistrationBtn.addEventListener('click', () => setTab(teamRegistrationBtn, teamPanel));
}

if (teamSizeSelect) {
  teamSizeSelect.addEventListener('change', updateTeamMembers);
  updateTeamMembers();
}

if (soloForm) {
  soloForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm({
      form: soloForm,
      statusElement: soloStatus,
      apiMethod: window.api.submitSoloRegistration,
      successMessage: 'Solo registration submitted successfully.',
    });
  });

  soloForm.addEventListener('input', (event) => {
    if (event.target.matches('.field__input')) {
      clearFieldError(event.target);
      clearStatus(soloStatus);
    }
  });
}

if (duoForm) {
  duoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm({
      form: duoForm,
      statusElement: duoStatus,
      apiMethod: window.api.submitDuoRegistration,
      successMessage: 'Duo registration submitted successfully.',
    });
  });

  duoForm.addEventListener('input', (event) => {
    if (event.target.matches('.field__input')) {
      clearFieldError(event.target);
      clearStatus(duoStatus);
    }
  });
}

if (teamForm) {
  teamForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm({
      form: teamForm,
      statusElement: teamStatus,
      apiMethod: window.api.submitTeamRegistration,
      successMessage: 'Team registration submitted successfully.',
    });
  });

  teamForm.addEventListener('input', (event) => {
    if (event.target.matches('.field__input')) {
      clearFieldError(event.target);
      clearStatus(teamStatus);
    }
  });
}
