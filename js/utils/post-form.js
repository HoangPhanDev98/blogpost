import { setBackgroundImage, setFieldValue, setTextContent } from './common';
import * as yup from 'yup';

function setFormValues(form, defaultValues) {
  setFieldValue(form, '[name="title"]', defaultValues.title);
  setFieldValue(form, '[name="author"]', defaultValues.author);
  setFieldValue(form, '[name="description"]', defaultValues.description);

  setFieldValue(form, '[name="imageUrl"]', defaultValues.imageUrl);
  setBackgroundImage(document, '#postHeroImage', defaultValues.imageUrl);
}

function getFormValues(form) {
  const formValues = {};

  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name=${name}]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatePostForm(form, formValues) {
  try {
    //reset previous errors
    ['title', 'author'].forEach((name) => setFieldError(form, name, ''));

    // start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    const errorLogs = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        // ignore if the field is already logged
        if (errorLogs[name]) continue;

        // set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLogs[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');

  return isValid;
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Save';
  }
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  setFormValues(form, defaultValues);
  let submitting = false;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitting) return;

    showLoading(form);

    submitting = true;

    // get form values
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    //validation
    const isValid = await validatePostForm(form, formValues);
    if (!isValid) return;

    await onSubmit?.(formValues);

    hideLoading(form);

    submitting = false;
  });
}
