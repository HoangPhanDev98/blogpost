import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncate } from './common';

// to use fromNow function
dayjs.extend(relativeTime);

export function createPostElement(post) {
  if (!post) return;

  // find and clone template
  const postTemplate = document.getElementById('postTemplate');
  if (!postTemplate) return;

  const liElement = postTemplate.content.querySelector('li').cloneNode(true);
  if (!liElement) return;

  // update title, description, author, thumbnail
  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="description"]', truncate(post.description, 100));
  setTextContent(liElement, '[data-id="author"]', post.author);
  //calculate timespan dayjs(post.updateAt).fromNow();
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updateAt).fromNow()}`);

  const thumbnailElement = liElement.querySelector('[data-id=thumbnail]');
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl;
    thumbnailElement.addEventListener('error', () => {
      console.log('load image error -> use default placeholder');
      thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
    });
  }

  // attach events
  // go to post detail when click on div.post-item
  const divElement = liElement.querySelector('.post-item');
  if (divElement) {
    divElement.addEventListener('click', (e) => {
      const menu = liElement.querySelector('[data-id="menu"]');
      if (menu && menu.contains(e.target)) return;

      window.location.assign(`/post-detail.html?id=${post.id}`);
    });
  }

  const menu = liElement.querySelector('[data-id="menu"]');

  const editButton = liElement.querySelector('[data-id="edit"]');
  if (editButton) {
    editButton.addEventListener('click', () => {
      window.location.assign(`/add-edit-post.html?id=${post.id}`);
    });
  }

  return liElement;
}

export function renderPostList(elmentId, postList) {
  if (!Array.isArray(postList)) return;

  const ulElement = document.getElementById(elmentId);
  if (!ulElement) return false;

  //   clear current list
  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
