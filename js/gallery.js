const galleryGrid = document.getElementById('galleryGrid');
const galleryViewer = document.getElementById('galleryViewer');
const galleryViewerImage = document.getElementById('galleryViewerImage');
const galleryViewerCaption = document.getElementById('galleryViewerCaption');
const availablePhotos = [];
let currentPhotoIndex = -1;
const placeholderPhotoFingerprints = {
  13: '4726FCF9873692342CB76A768E17659D3B701228F00821EF3CEFA9CDAF679AE5',
  19: '65A149806FA203C7059A97158C926E58E8347C9E064C4D3625B01060B278AD6D',
};

const photos = Array.from({ length: 32 }, (_, index) => {
  const number = index + 1;
  return {
    number,
    filename: `image${number}.jpg`,
    src: `images/gallery/image${number}.jpg`,
    alt: `AI HACKSPRINT 1.0 event photo ${number}`,
  };
});

const createPhotoPlaceholder = (photo) => {
  const placeholder = document.createElement('div');
  placeholder.className = 'gallery-card__placeholder';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', `${photo.alt}; ${photo.filename} has not been added yet`);
  placeholder.innerHTML = `
    <span class="gallery-card__placeholder-number">${String(photo.number).padStart(2, '0')}</span>
    <span class="gallery-card__placeholder-label">Image ${String(photo.number).padStart(2, '0')}</span>
    <span class="gallery-card__placeholder-file">${photo.filename}</span>
  `;
  return placeholder;
};

const createPhotoCard = (photo, isAvailable) => {
  const card = document.createElement('article');
  card.className = 'gallery-card';
  card.dataset.photoNumber = String(photo.number);

  if (isAvailable) {
    const openButton = document.createElement('button');
    openButton.className = 'gallery-card__open';
    openButton.type = 'button';
    openButton.setAttribute('aria-label', `Open ${photo.alt}`);

    const image = document.createElement('img');
    image.className = 'gallery-card__image';
    image.src = photo.src;
    image.alt = photo.alt;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      availablePhotos.splice(availablePhotos.indexOf(photo), 1);
      openButton.replaceWith(createPhotoPlaceholder(photo));
      downloadLink.remove();
    }, { once: true });

    const number = document.createElement('span');
    number.className = 'gallery-card__number';
    number.textContent = `PHOTO ${String(photo.number).padStart(2, '0')}`;

    openButton.append(image, number);
    openButton.addEventListener('click', () => openPhoto(photo));
    card.appendChild(openButton);

    const downloadLink = document.createElement('a');
    downloadLink.className = 'gallery-card__download';
    downloadLink.href = photo.src;
    downloadLink.download = `AI-HACKSPRINT-Image-${photo.number}.jpg`;
    downloadLink.setAttribute('aria-label', `Download AI HACKSPRINT 1.0 event photo ${photo.number}`);
    downloadLink.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3V15M7 10L12 15L17 10M5 20H19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Download Image</span>
    `;
    card.appendChild(downloadLink);
  } else {
    card.appendChild(createPhotoPlaceholder(photo));
  }

  return card;
};

const matchesPlaceholderFingerprint = async (photo, source) => {
  const expectedFingerprint = placeholderPhotoFingerprints[photo.number];
  if (!expectedFingerprint) return false;

  try {
    const response = await fetch(source, { cache: 'no-store' });
    if (!response.ok) return false;

    const digest = await crypto.subtle.digest('SHA-256', await response.arrayBuffer());
    const fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    return fingerprint === expectedFingerprint;
  } catch {
    return false;
  }
};

const checkPhotoAvailability = async (photo) => {
  const sources = [
    `images/gallery/image${photo.number}.jpg`,
    `images/gallery/image${photo.number}.JPG`,
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source, { method: 'HEAD', cache: 'no-store' });
      if (response.ok && (response.headers.get('content-type') || '').startsWith('image/')) {
        if (await matchesPlaceholderFingerprint(photo, source)) return false;
        photo.src = source;
        photo.filename = source.split('/').pop();
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
};

const renderGallery = async () => {
  const availability = await Promise.all(photos.map(checkPhotoAvailability));

  photos.forEach((photo, index) => {
    if (availability[index]) {
      availablePhotos.push(photo);
    }
    galleryGrid.appendChild(createPhotoCard(photo, availability[index]));
  });
};

const openPhoto = (photo) => {
  currentPhotoIndex = availablePhotos.indexOf(photo);
  if (currentPhotoIndex < 0) return;

  galleryViewerImage.src = photo.src;
  galleryViewerImage.alt = photo.alt;
  galleryViewerCaption.textContent = `${photo.alt} · ${currentPhotoIndex + 1} of ${availablePhotos.length}`;
  galleryViewer.showModal();
};

const showAdjacentPhoto = (direction) => {
  if (!availablePhotos.length || currentPhotoIndex < 0) return;
  currentPhotoIndex = (currentPhotoIndex + direction + availablePhotos.length) % availablePhotos.length;
  const photo = availablePhotos[currentPhotoIndex];
  galleryViewerImage.src = photo.src;
  galleryViewerImage.alt = photo.alt;
  galleryViewerCaption.textContent = `${photo.alt} · ${currentPhotoIndex + 1} of ${availablePhotos.length}`;
};

document.getElementById('galleryPrevious').addEventListener('click', () => showAdjacentPhoto(-1));
document.getElementById('galleryNext').addEventListener('click', () => showAdjacentPhoto(1));
document.getElementById('galleryClose').addEventListener('click', () => galleryViewer.close());

galleryViewer.addEventListener('click', (event) => {
  if (event.target === galleryViewer) galleryViewer.close();
});

galleryViewer.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showAdjacentPhoto(-1);
  if (event.key === 'ArrowRight') showAdjacentPhoto(1);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && galleryViewer.open) galleryViewer.close();
});

renderGallery();
