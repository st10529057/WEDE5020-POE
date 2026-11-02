
const galleryImages = Array.from(
    document.querySelectorAll(".gallery img")
);

const slides = galleryImages.map(image => ({
    src: image.src,
    alt: image.alt,
    caption: image.dataset.caption || image.alt
}));

let currentSlide = 0;
let isPlaying = true;
let slideshowTimer;
let previousFocus = null;

const slideImage = document.getElementById("slideImage");
const slideCaption = document.getElementById("slideCaption");
const slideCounter = document.getElementById("slideCounter");
const playBtn = document.getElementById("playBtn");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

// Display a slideshow image.
function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    const slide = slides[currentSlide];

    slideImage.src = slide.src;
    slideImage.alt = slide.alt;
    slideCaption.textContent = slide.caption;
    slideCounter.textContent =
        `${currentSlide + 1} / ${slides.length}`;
}

// Move between slides.
function nextSlide() {
    showSlide(currentSlide + 1);
}

function previousSlide() {
    showSlide(currentSlide - 1);
}

// Automatic slideshow.
function startSlideshow() {
    clearInterval(slideshowTimer);

    if (isPlaying && !lightbox.classList.contains("active")) {
        slideshowTimer = setInterval(nextSlide, 4000);
    }
}

function toggleSlideshow() {
    isPlaying = !isPlaying;

    playBtn.textContent = isPlaying
        ? "Pause Slideshow"
        : "Play Slideshow";

    startSlideshow();
}

// Slideshow buttons.
document.getElementById("nextBtn").addEventListener(
    "click", nextSlide
);

document.getElementById("prevBtn").addEventListener(
    "click", previousSlide
);

playBtn.addEventListener("click", toggleSlideshow);

// Open the lightbox.
function openLightbox(index) {
    currentSlide = index;
    previousFocus = document.activeElement;

    showLightboxImage();

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    document.getElementById("closeBtn").focus();

    clearInterval(slideshowTimer);
}

// Update the lightbox image and caption.
function showLightboxImage() {
    const slide = slides[currentSlide];

    lightboxImage.src = slide.src;
    lightboxImage.alt = slide.alt;
    lightboxCaption.textContent =
        `${slide.caption} (${currentSlide + 1} of ${slides.length})`;
}

// Lightbox navigation.
function nextLightboxImage() {
    currentSlide = (currentSlide + 1) % slides.length;
    showLightboxImage();
}

function previousLightboxImage() {
    currentSlide =
        (currentSlide - 1 + slides.length) % slides.length;

    showLightboxImage();
}

document.getElementById("lightboxNext").addEventListener(
    "click", nextLightboxImage
);

document.getElementById("lightboxPrev").addEventListener(
    "click", previousLightboxImage
);

// Close the lightbox.
function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
    }

    startSlideshow();
}

document.getElementById("closeBtn").addEventListener(
    "click", closeLightbox
);

// Clicking the dark background closes the lightbox.
lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Click a gallery thumbnail to open the matching image.
galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => openLightbox(index));
});

// Click the slideshow image to open it in the lightbox.
slideImage.addEventListener("click", () => {
    openLightbox(currentSlide);
});

// Keyboard controls.
document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowRight") {
        nextLightboxImage();
    } else if (event.key === "ArrowLeft") {
        previousLightboxImage();
    }
});

// Start the slideshow.
showSlide(0);
startSlideshow();

