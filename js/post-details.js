import postApi from './api/postApi';
import { registerLightbox, setTextContent } from './utils';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

function renderPostDetail(post) {
  if (!post) return;

  // render title, author, timespan, description
  setTextContent(document, '#postDetailTitle', post.title);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetailTimeSpan', `- ${dayjs(post.updateAt).format('llll')}`);
  setTextContent(document, '#postDetailDescription', post.description);

  // render hero image
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;

    heroImage.addEventListener('error', () => {
      heroImage.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    editPageLink.innerHTML = '<i class="fas fa-edit"></i> &nbsp; Edit Post';
  }
}

(async () => {
  try {
    registerLightbox({
      modalId: 'lightbox',
      imgSelector: 'img[data-id="lightboxImg"]',
      prevSelector: 'button[data-id="lightboxPrev"]',
      nextSelector: 'button[data-id="lightboxNext"]',
    });

    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    if (!postId) return;

    const post = await postApi.getById(postId);

    renderPostDetail(post);
  } catch (error) {
    console.log('failed to fetch post detail', error);
  }
})();
