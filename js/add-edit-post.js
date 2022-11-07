import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

async function handlePostFormSubmit(formValues) {
  console.log('submit from parent', formValues);
  try {
    // check add/edit mode
    // S1: based on search params (check id)
    // S2: check id in formValues
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues);

    // show success message
    toast.success('Save post successfully!');

    //redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`);
    }, 2000);
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
}

(async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const postId = searchParams.get('id');

  const defaultValues = postId
    ? await postApi.getById(postId)
    : {
        title: '',
        description: '',
        author: '',
        imgUrl: '',
      };

  initPostForm({
    formId: 'postForm',
    defaultValues,
    onSubmit: handlePostFormSubmit,
  });
})();
