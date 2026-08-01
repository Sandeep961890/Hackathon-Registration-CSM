const soloRegistrationBtn = document.getElementById('soloRegistrationBtn');
const teamRegistrationBtn = document.getElementById('teamRegistrationBtn');
const soloPanel = document.getElementById('soloPanel');
const teamPanel = document.getElementById('teamPanel');
const teamSizeSelect = document.getElementById('teamSize');
const teamMembersContainer = document.getElementById('teamMembersContainer');
const soloForm = document.getElementById('soloForm');
const teamForm = document.getElementById('teamForm');
const soloStatus = document.getElementById('soloStatus');
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
  const inactiveButton = activeButton === soloRegistrationBtn ? teamRegistrationBtn : soloRegistrationBtn;
  const inactivePanel = activePanel === soloPanel ? teamPanel : soloPanel;

  activeButton.classList.add('tab-button--active');
  activeButton.setAttribute('aria-selected', 'true');
  inactiveButton.classList.remove('tab-button--active');
  inactiveButton.setAttribute('aria-selected', 'false');

  activePanel.classList.add('registration-panel--active');
  activePanel.removeAttribute('hidden');
  inactivePanel.classList.remove('registration-panel--active');
  inactivePanel.setAttribute('hidden', '');
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

const validateField = (field) => {
  const value = field.value.trim();
  const label = getLabelText(field);

  if (!value) {
    return `${label} is required.`;
  }

  if (/mobile/i.test(field.name)) {
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

const buildTeamPayload = (form) => {
  const payload = getFormValues(form);
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

const submitForm = async ({ form, statusElement, apiMethod, successMessage }) => {
  if (!form || !statusElement) return;
  if (!validateForm(form)) return;

  clearStatus(statusElement);
  setStatus(statusElement, 'Sending registration…', '');

  const data = apiMethod === window.api.submitTeamRegistration
    ? buildTeamPayload(form)
    : getFormValues(form);

  try {
    await apiMethod(data);
    setStatus(statusElement, successMessage, 'success');
    form.reset();

    if (form === teamForm && teamSizeSelect) {
      updateTeamMembers();
    }
  } catch (error) {
    setStatus(statusElement, error?.message || 'Unable to send registration. Please try again.', 'error');
  }
};

if (soloRegistrationBtn && teamRegistrationBtn && soloPanel && teamPanel) {
  soloRegistrationBtn.addEventListener('click', () => setTab(soloRegistrationBtn, soloPanel));
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
