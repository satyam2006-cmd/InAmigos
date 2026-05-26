gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();
});

/* ═══ 1. WELCOME SCREEN ANIMATION ═══ */
function initWelcomeScreen() {
  const tl = gsap.timeline({
    onComplete: () => {
      document.getElementById("welcome-screen").style.display = "none";
      document.body.style.overflow = "";
      initPageAnimations();
    },
  });

  document.body.style.overflow = "hidden";

  // Stagger character reveal with blur
  tl.to(".welcome-line span", {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    y: 0,
    duration: 0.05,
    stagger: 0.03,
    ease: "power2.out",
    delay: 0.2,
  })
    .to(
      ".welcome-tagline",
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.25",
    )
    // Hold the text (perfect 1-second readability window)
    .to({}, { duration: 1.0 })
    // Slide text up
    .to(".welcome-inner", {
      y: -70,
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
    })
    // Split mask away
    .to(
      ".welcome-mask-left",
      {
        xPercent: -100,
        duration: 0.6,
        ease: "power3.inOut",
      },
      "-=0.3",
    )
    .to(
      ".welcome-mask-right",
      {
        xPercent: 100,
        duration: 0.6,
        ease: "power3.inOut",
      },
      "<",
    )
    .to(
      ".welcome-screen",
      {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.2",
    );
}

/* ═══ 2. PAGE ANIMATIONS ═══ */
function initPageAnimations() {
  initScrollProgress();
  initHeroAnimations();
  initNavbar();
  initAnchorScrolling();
  initAboutTextReveal();
  initAboutCards();
  initHorizontalScroll();
  initImpactSection();
  initGallery();
  initEventsSection();
  initProjectModal();
  initFAQAccordion();
  initVolunteerModal();
  initCTASection();
  initMagneticButtons();
  initImpactRailCard();
}

/* ─── Hero Animations ─── */
function initHeroAnimations() {
  const heroTl = gsap.timeline({ delay: 0.2 });

  heroTl
    .to(".hero-tag", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
    .to(
      ".hero-headline",
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4",
    )
    .to(
      ".hero-sub",
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.4",
    )
    .to(
      ".hero-buttons",
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.4",
    )
    .to(
      ".hero-stats",
      { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      "-=0.3",
    )
    .to(".hero-scroll-indicator", { opacity: 1, duration: 0.6 }, "-=0.2");

  // Set initial states
  gsap.set(
    [
      ".hero-tag",
      ".hero-headline",
      ".hero-sub",
      ".hero-buttons",
      ".hero-stats",
    ],
    {
      y: 30,
    },
  );

  // Parallax background
  gsap.to(".hero-bg", {
    yPercent: 25,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

/* ─── Impact Rail Navigation ─── */
function initNavbar() {
  // Dynamic section highlighter
  const sections = document.querySelectorAll("section[id]");
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 160px",
      end: "bottom 160px",
      onToggle: (self) => {
        if (self.isActive) {
          const id = section.getAttribute("id");
          document
            .querySelectorAll(".impact-rail-link")
            .forEach((link) => {
              link.classList.remove("active");
            });
          const activeNavLinks = document.querySelectorAll(
            `.impact-rail-link[href="#${id}"]`,
          );
          activeNavLinks.forEach((link) => link.classList.add("active"));
        }
      },
    });
  });
}

/* ─── Anchor Scrolling ─── */
function initAnchorScrolling() {
  const projectLinks = document.querySelectorAll('a[href="#projects"]');
  const projectCarousel = document.getElementById("projects-carousel-stage");
  if (!projectCarousel) return;

  function scrollToProjectCarousel() {
    const railOffset = window.innerWidth <= 768 ? 96 : 36;
    const targetTop =
      projectCarousel.getBoundingClientRect().top + window.scrollY - railOffset;

    window.scrollTo({
      top: targetTop,
      behavior: "smooth",
    });
  }

  projectLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.pushState(null, "", "#projects");
      scrollToProjectCarousel();
    });
  });

  if (window.location.hash === "#projects") {
    window.setTimeout(scrollToProjectCarousel, 100);
  }
}

/* ─── About Text Reveal (word-by-word) ─── */
function initAboutTextReveal() {
  const paragraph = document.querySelector(".about-reveal-paragraph");
  if (!paragraph) return;

  const text = paragraph.textContent.trim();
  paragraph.innerHTML = "";

  const words = text.split(/\s+/);
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.classList.add("word");
    span.textContent = word;
    paragraph.appendChild(span);
    if (i < words.length - 1) {
      paragraph.appendChild(document.createTextNode(" "));
    }
  });

  const wordSpans = paragraph.querySelectorAll(".word");

  ScrollTrigger.create({
    trigger: ".about-text-reveal",
    start: "top 80%",
    end: "bottom 30%",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const activeCount = Math.floor(progress * wordSpans.length);
      wordSpans.forEach((w, i) => {
        w.classList.toggle("active", i < activeCount);
      });
    },
  });
}

/* ─── About Detail Cards ─── */
function initAboutCards() {
  const items = document.querySelectorAll(".recognition-item");
  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 85%",
      onEnter: () => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: "power2.out",
        });
        item.classList.add("visible");
      },
      once: true,
    });
  });
}

/* ─── Projects Carousel ─── */
function initHorizontalScroll() {
  const stage = document.getElementById("projects-carousel-stage");
  const items = gsap.utils.toArray(".project-carousel-item");
  if (!stage || !items.length) return;

  let progress = 0;
  let activeIndex = 0;

  const getZindex = (array, index) =>
    array.map((_, i) =>
      index === i ? array.length : array.length - Math.abs(index - i),
    );

  function displayItems(item, index) {
    const activeProgress = (progress / 100) * (items.length - 1);
    const zIndex = getZindex(items, activeIndex)[index];
    item.style.setProperty("--zIndex", zIndex);
    item.style.setProperty("--active", (index - activeProgress) / items.length);
  }

  function animate() {
    progress = Math.max(0, Math.min(progress, 100));
    activeIndex = Math.round((progress / 100) * (items.length - 1));
    items.forEach(displayItems);
  }

  ScrollTrigger.create({
    trigger: stage,
    start: "top 12%",
    end: () => `+=${items.length * window.innerHeight * 0.48}`,
    scrub: 0.45,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      progress = self.progress * 100;
      animate();
    },
  });

  animate();
}

/* ─── Impact Section ─── */
function initImpactSection() {
  const items = document.querySelectorAll(
    ".impact-stat-item, .impact-carousel-shell",
  );
  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 85%",
      onEnter: () => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power2.out",
        });
        item.classList.add("visible");
      },
      once: true,
    });
  });

  // Counter animation
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    ScrollTrigger.create({
      trigger: counter,
      start: "top 85%",
      onEnter: () => animateCounter(counter),
      once: true,
    });
  });

  initImpactCarousel();
}

function animateCounter(el) {
  const target = +el.getAttribute("data-target");
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = Math.ceil(obj.val).toLocaleString();
    },
  });
}

function initImpactCarousel() {
  const cards = gsap.utils.toArray(".impact-carousel-card");
  if (!cards.length) return;

  const totalItems = cards.length;
  const offset = window.innerWidth <= 768 ? 18 : 34;
  let currentItem = 0;

  function updatePositions() {
    for (let i = 0; i < totalItems; i++) {
      const itemIndex = (currentItem + i) % totalItems;
      const card = cards[itemIndex];
      gsap.to(card, {
        duration: 0.8,
        x: offset * i,
        y: -offset * i,
        zIndex: totalItems - i,
        scale: 1 - i * 0.035,
        opacity: 1 - i * 0.08,
        ease: "power2.out",
      });
    }
  }

  gsap.set(cards, {
    x: (index) => offset * index,
    y: (index) => -offset * index,
    zIndex: (index) => totalItems - index,
    scale: (index) => 1 - index * 0.035,
    opacity: (index) => 1 - index * 0.08,
  });

  updatePositions();
  window.setInterval(() => {
    currentItem = (currentItem + 1) % totalItems;
    updatePositions();
  }, 2200);
}

/* ─── Gallery ─── */
function initGallery() {
  const items = document.querySelectorAll(".gallery-item-new");
  items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: "top 88%",
      onEnter: () => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: "power2.out",
        });
        item.classList.add("visible");
      },
      once: true,
    });
  });
}

/* ─── Events Section ─── */
const eventDetails = {
  water: {
    title: "World Water Day 2025",
    category: "Community",
    image: "assets/images/project-prakriti.jpg",
    imageAlt: "Tree and water conservation activity for World Water Day",
    description:
      "Water is essential for life, yet millions worldwide face water scarcity and pollution. World Water Day is a global initiative to raise awareness about water conservation and responsible usage. InAmigos Foundation is organizing an interactive event to educate and inspire individuals to take meaningful action toward a water-secure future.",
    highlights: [
      "Awareness sessions on water conservation and sustainability",
      "Expert talks on global water challenges and solutions",
      "Workshops on rainwater harvesting and water-efficient practices",
      "Community engagement activities to promote clean water initiatives",
    ],
    closing:
      "Let us come together to protect and preserve our most precious resource: water.",
    details: [
      ["Start Date & Time", "22 Mar 2025 06:00 pm"],
      ["End Date & Time", "23 Mar 2025 12:00 am"],
      ["Location", "Online"],
      ["Category", "Community"],
      ["Organizer Email", "Hr@inamigosfoundation.org.in"],
      ["Phone", "+91 6267 309 902"],
      ["Address", "online"],
    ],
  },
  happiness: {
    title: "International Day of Happiness 2025",
    category: "Community",
    image: "assets/images/groupactivity.webp",
    imageAlt: "Community gathering for happiness and well-being",
    description:
      "Happiness is not just a feeling; it is a way of life. The International Day of Happiness is dedicated to promoting global well-being, kindness, and positive change. InAmigos Foundation invites you to be part of this celebration, where we explore the science of happiness and how small actions can make a big impact on our lives and society.",
    highlights: [
      "Interactive sessions on mindfulness and well-being",
      "Fun activities promoting happiness and positivity",
      "Discussions on mental health awareness and self-care",
      "Spreading kindness through community engagement",
    ],
    closing:
      "Let us come together to create a happier, more compassionate world, one smile at a time.",
    details: [
      ["Start Date & Time", "20 Mar 2025 06:00 pm"],
      ["End Date & Time", "21 Mar 2025 12:00 am"],
      ["Location", "Online"],
      ["Category", "Community"],
      ["Organizer Email", "Hr@inamigosfoundation.org.in"],
      ["Phone", "+91 6267 309 902"],
      ["Address", "Online"],
    ],
  },
  science: {
    title: "International Day of Women and Girls in Science 2025",
    category: "Education",
    image: "assets/images/project-udaan.jpg",
    imageAlt: "Women empowerment artwork for science and education",
    description:
      "The International Day of Women and Girls in Science is a global initiative that highlights the crucial role women play in scientific advancements and innovation. InAmigos Foundation is hosting a special event to honor the achievements of women in STEM, encourage young girls to pursue careers in science, and foster an inclusive environment for future innovators.",
    highlights: [],
    closing:
      "Together, let us break barriers and create a future where women and girls thrive in science and technology.",
    details: [
      ["Start Date & Time", "11 Feb 2025 12:30 pm"],
      ["End Date & Time", "12 Feb 2025 12:00 am"],
      ["Location", "Rohtak, Haryana"],
      ["Category", "Education"],
      ["Organizer Email", "Hr@inamigosfoundation.org.in"],
      ["Phone", "+91 6267 309 902"],
      ["Address", "Rohtak, Haryana"],
    ],
  },
};

function initEventsSection() {
  const deck = document.getElementById("events-grid");
  const cards = Array.from(document.querySelectorAll(".event-card"));
  const prevBtn = document.getElementById("events-prev");
  const nextBtn = document.getElementById("events-next");
  const dotsWrap = document.getElementById("events-dots");
  const readMoreLinks = document.querySelectorAll(".event-read-more");
  const modalOverlay = document.getElementById("event-modal-overlay");
  const modal = document.getElementById("event-modal");
  const modalClose = document.getElementById("event-modal-close");
  if (!deck || !cards.length || !prevBtn || !nextBtn || !dotsWrap) return;

  let activeIndex = 0;
  let autoplay;

  const dots = cards.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = "events-deck-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Show event ${index + 1}`);
    dot.addEventListener("click", () => {
      setActive(index);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function setActive(index) {
    activeIndex = (index + cards.length) % cards.length;

    cards.forEach((card, cardIndex) => {
      const offset = (cardIndex - activeIndex + cards.length) % cards.length;
      card.classList.remove("is-active", "is-next", "is-after-next", "is-prev");

      if (offset === 0) card.classList.add("is-active");
      else if (offset === 1) card.classList.add("is-next");
      else if (offset === 2) card.classList.add("is-after-next");
      else card.classList.add("is-prev");
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
      dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
    });
  }

  function next() {
    setActive(activeIndex + 1);
  }

  function restartAutoplay() {
    window.clearInterval(autoplay);
    autoplay = window.setInterval(next, 4200);
  }

  prevBtn.addEventListener("click", () => {
    setActive(activeIndex - 1);
    restartAutoplay();
  });

  nextBtn.addEventListener("click", () => {
    next();
    restartAutoplay();
  });

  deck.addEventListener("mouseenter", () => window.clearInterval(autoplay));
  deck.addEventListener("mouseleave", restartAutoplay);

  function openEventModal(eventId) {
    const data = eventDetails[eventId];
    if (!data || !modalOverlay) return;

    document.getElementById("event-modal-img").src = data.image;
    document.getElementById("event-modal-img").alt = data.imageAlt;
    document.getElementById("event-modal-category").textContent =
      data.category;
    document.getElementById("event-modal-title").textContent = data.title;
    document.getElementById("event-modal-desc").textContent = data.description;
    document.getElementById("event-modal-closing").textContent = data.closing;

    const highlights = document.getElementById("event-modal-highlights");
    highlights.innerHTML = "";
    if (data.highlights.length) {
      const h4 = document.createElement("h4");
      h4.textContent = "Key Highlights";
      const ul = document.createElement("ul");
      data.highlights.forEach((highlight) => {
        const li = document.createElement("li");
        li.textContent = highlight;
        ul.appendChild(li);
      });
      highlights.append(h4, ul);
    }

    const details = document.getElementById("event-modal-details");
    details.innerHTML = "";
    data.details.forEach(([label, value]) => {
      const item = document.createElement("div");
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = label;
      dd.textContent = value;
      item.append(dt, dd);
      details.appendChild(item);
    });

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    window.clearInterval(autoplay);
  }

  function closeEventModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
    restartAutoplay();
  }

  readMoreLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openEventModal(link.dataset.event);
    });
  });

  if (modalOverlay && modal && modalClose) {
    modalClose.addEventListener("click", closeEventModal);
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeEventModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        closeEventModal();
      }
    });
  }

  setActive(0);
  restartAutoplay();
}

/* ─── CTA Section ─── */
function initCTASection() {
  // Background scale
  gsap.to("#cta-bg-scale", {
    scale: 1,
    opacity: 1,
    scrollTrigger: {
      trigger: ".cta-section",
      start: "top 80%",
      end: "top 20%",
      scrub: true,
    },
  });

  // Words stagger
  ScrollTrigger.create({
    trigger: ".cta-headline",
    start: "top 75%",
    onEnter: () => {
      gsap.to(".cta-word", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });
      gsap.to(".cta-sub", {
        opacity: 1,
        duration: 0.7,
        delay: 0.5,
        ease: "power2.out",
      });
      gsap.to(".cta-btn", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.6,
        ease: "power2.out",
      });
    },
    once: true,
  });
}

/* ─── Magnetic Buttons ─── */
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll(".magnetic-btn");
  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: "power2.out",
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.4)" });
    });
  });
}

/* ─── Impact Rail Card ─── */
function initImpactRailCard() {
  const trigger = document.getElementById("impact-rail-profile");
  const card = document.getElementById("impact-rail-card");
  if (!trigger || !card) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = card.classList.toggle("active");
    trigger.classList.toggle("active", isActive);
    trigger.setAttribute("aria-expanded", String(isActive));
  });

  document.addEventListener("click", (e) => {
    if (!card.contains(e.target) && e.target !== trigger) {
      card.classList.remove("active");
      trigger.classList.remove("active");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

/* ─── Project Modal System ─── */
const projectData = {
  vikas: {
    number: "01",
    title: "Project Vikas",
    image: "assets/images/project-vikas.jpg",
    tags: ["Youth", "Skills", "Career"],
    description:
      "Project Vikas focuses on empowering the youth of India by enhancing their employability through comprehensive skill development programs, professional training sessions, career counseling, mentorship, and high-impact internships. We bridge the gap between academic learning and industry expectations, preparing young minds to become future leaders.",
    highlights: [
      "500+ Youth trained in professional and leadership skills",
      "Partnership with industry leaders for internship and job opportunities",
      "Regular career mentoring and guidance webinars",
      "Focus on resume writing, digital literacy, and public speaking",
    ],
  },
  jeev: {
    number: "02",
    title: "Project Jeev",
    image: "assets/images/project-jeev.jpg",
    tags: ["Animal Welfare", "Rescue", "Protection"],
    description:
      "Project Jeev is dedicated to advocating animal welfare and restoring dignity to stray and wild animals. Through daily feeding drives, medical rescue operations, vaccination programs, and building reflective collars for stray dogs, we ensure a safer, healthier, and more compassionate environment for our co-inhabitants.",
    highlights: [
      "1,200+ Stray animals fed and monitored regularly",
      "Emergency rescue and first-aid operations for injured strays",
      "Reflective collar drives to prevent road accidents",
      "Awareness campaigns to foster neighborhood coexistence",
    ],
  },
  udaan: {
    number: "03",
    title: "Project Udaan",
    image: "assets/images/project-udaan.jpg",
    tags: ["Women", "Empowerment", "Skills"],
    description:
      "Project Udaan strives to dismantle socio-economic barriers by empowering women from marginalized backgrounds. We provide training in sewing, handicrafts, digital literacy, and financial planning, alongside essential sessions on legal rights and health hygiene, to help women achieve financial independence and become pillars of community transformation.",
    highlights: [
      "Skill development centers for tailoring and self-employment",
      "Interactive financial planning and digital banking training",
      "Menstrual health awareness & sanitary pad distribution campaigns",
      "Legal awareness and leadership development modules",
    ],
  },
  prakriti: {
    number: "04",
    title: "Project Prakriti",
    image: "assets/images/project-prakriti.jpg",
    tags: ["Environment", "Sustainability", "Green"],
    description:
      "Project Prakriti is our pledge to save mother earth. Through large-scale tree plantation drives, seed-ball making workshops, and cleaning campaigns of local water bodies, we raise environment consciousness and build sustainable eco-friendly practices that combat environmental degradation and climate change.",
    highlights: [
      "2,500+ Saplings planted and nurtured across cities",
      "Seed-ball making workshops for reforestation",
      "Anti-plastic drives and waste segregation awareness",
      "Cleanliness campaigns at heritage sites and local parks",
    ],
  },
  bachpanshala: {
    number: "05",
    title: "BachpanShala",
    image: "assets/images/project-bachpanshala.jpg",
    tags: ["Education", "Children", "Learning"],
    description:
      "BachpanShala is our dedicated classroom for hope. By bringing education and creative learning experiences to underprivileged children in slums and rural communities, we build basic literacy, distribute essential school supplies, and promote digital learning to give every child a fair chance at building a brighter tomorrow.",
    highlights: [
      "Weekend classes for core subjects, arts, and value education",
      "Free distribution of textbooks, stationery, and backpacks",
      "Basic computer literacy and storytelling hours",
      "Reducing dropout rates in local government schools",
    ],
  },
  seva: {
    number: "06",
    title: "Project Seva",
    image: "assets/images/about-ngo.jpg",
    tags: ["Food", "Clothing", "Support"],
    description:
      "Project Seva stands as our active disaster and community relief initiative. In times of crisis or extreme weather, we execute distribution drives to supply healthy food, clean drinking water, warm clothes, hygiene kits, and basic necessities to families in remote and underprivileged communities, restoring human dignity.",
    highlights: [
      "Regular nutrition and food distribution drives",
      "Winter clothing and blanket distributions",
      "Medical checkup camps and emergency medicines supply",
      "Disaster relief and seasonal rehabilitation support",
    ],
  },
  "mission-life": {
    number: "07",
    title: "Mission Life",
    image: "assets/images/project-prakriti2.jpg",
    tags: ["Sustainability", "Awareness", "Climate"],
    description:
      "Mission Life reflects InAmigos Foundation's vision for a sustainable development future. Inspired by the blog theme, it promotes mindful living, environmental responsibility, reduced waste, and collective action for a cleaner, healthier planet.",
    highlights: [
      "Awareness around sustainable consumption and daily habits",
      "Community action for environmental protection",
      "Encouraging food, water, and energy responsibility",
      "A call for citizens to save earth and save life",
    ],
  },
  "save-water": {
    number: "08",
    title: "Save Water",
    image: "assets/images/groupactivity2.jpg",
    tags: ["Water", "Conservation", "Community"],
    description:
      "Save Water, Save Life is a campaign focused on water conservation, responsible usage, and clean water accessibility. It highlights rainwater harvesting, water management workshops, tree plantation, and simple everyday actions that protect this essential resource.",
    highlights: [
      "Rainwater harvesting campaigns in urban and rural areas",
      "Workshops on efficient water usage and leak detection",
      "Tree plantation to support groundwater recharge",
      "Clean water awareness for underserved communities",
    ],
  },
  "healthy-lifestyle": {
    number: "09",
    title: "Healthy Lifestyle",
    image: "assets/images/volunteergroupphoto.jpg",
    tags: ["Health", "Wellbeing", "Awareness"],
    description:
      "Adopt a Healthy Lifestyle is a holistic well-being initiative inspired by InAmigos Foundation's blog. It encourages nutrition, physical activity, sleep, stress management, mental health, and consistent healthy choices.",
    highlights: [
      "Promoting nutrition and balanced daily routines",
      "Encouraging physical activity and adequate sleep",
      "Stress management and mental health awareness",
      "Reducing harmful habits through community education",
    ],
  },
  "sustainable-living": {
    number: "10",
    title: "Sustainable Living",
    image: "assets/images/volunteer2.jpg",
    tags: ["LIFE", "Waste", "Green Living"],
    description:
      "Sustainable Living brings together the LIFE themes shared by InAmigos Foundation: saving energy, saving water, reducing waste, and adopting practical habits that protect the environment while strengthening communities.",
    highlights: [
      "Saving energy through efficient appliances and mindful usage",
      "Water conservation through low-flow fixtures and reuse",
      "Waste segregation, recycling, and composting",
      "Carpooling, local produce, and minimalist consumption",
    ],
  },
};

function initProjectModal() {
  const overlay = document.getElementById("project-modal-overlay");
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("project-modal-close");
  const panels = document.querySelectorAll(".project-carousel-item");

  if (!overlay || !modal || !closeBtn) return;

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    // Populate data fields
    document.getElementById("project-modal-img-el").src = data.image;
    document.getElementById("project-modal-img-el").alt = data.title;
    document.getElementById("project-modal-number").textContent = data.number;
    document.getElementById("project-modal-title").textContent = data.title;

    // Populate tags
    const tagsContainer = document.getElementById("project-modal-tags");
    tagsContainer.innerHTML = "";
    data.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    // Populate description
    document.getElementById("project-modal-desc").textContent =
      data.description;

    // Populate highlights
    const highlightsContainer = document.getElementById(
      "project-modal-highlights",
    );
    highlightsContainer.innerHTML = "<h4>Key Highlights</h4>";
    const ul = document.createElement("ul");
    data.highlights.forEach((highlight) => {
      const li = document.createElement("li");
      li.textContent = highlight;
      ul.appendChild(li);
    });
    highlightsContainer.appendChild(ul);

    // Show modal & overlay
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // GSAP Animation entry
    gsap.killTweensOf(modal);
    gsap.fromTo(
      modal,
      { scale: 0.92, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
    );
  }

  function closeProjectModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";

    gsap.killTweensOf(modal);
    gsap.to(modal, {
      scale: 0.95,
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
  }

  // Setup click triggers on all panels
  panels.forEach((panel) => {
    panel.addEventListener("click", (e) => {
      // Prevent opening if the click was specifically targeted on something else inside
      const projectId = panel.getAttribute("data-project");
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  // Close triggers
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeProjectModal();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeProjectModal();
    }
  });

  // Escape key close
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeProjectModal();
    }
  });
}

/* ─── Scroll Progress Bar ─── */
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    const railOffset = window.innerWidth <= 768 ? 0 : 92;
    bar.style.width = `calc((100vw - ${railOffset}px) * ${scrollPercent / 100})`;
  });
}

/* ─── FAQ Accordion ─── */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    trigger.setAttribute("aria-expanded", String(item.classList.contains("active")));
    trigger.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close other FAQ items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("active");
          const otherTrigger = other.querySelector(".faq-trigger");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current FAQ item
      item.classList.toggle("active", !isActive);
      trigger.setAttribute("aria-expanded", String(!isActive));
    });
  });
}

/* ─── Volunteer Registration Form Modal ─── */
function initVolunteerModal() {
  const overlay = document.getElementById("volunteer-modal-overlay");
  const modal = document.getElementById("volunteer-modal");
  const closeBtn = document.getElementById("volunteer-modal-close");
  const form = document.getElementById("volunteer-form");
  const successMsg = document.getElementById("form-success-message");

  // Triggers
  const openTriggers = document.querySelectorAll(
    '.open-volunteer-trigger, a[href*="volunteers"], #side-join-btn, #hero-volunteer-btn, #cta-join-btn, #cta-volunteer-btn',
  );

  if (!overlay || !modal || !closeBtn || !form) return;

  function openVolunteerModal() {
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // Reset form states
    form.style.display = "flex";
    form.style.opacity = 1;
    form.style.transform = "translateY(0)";
    successMsg.classList.remove("visible");
    form.reset();

    gsap.killTweensOf(modal);
    gsap.fromTo(
      modal,
      { scale: 0.92, y: 30, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
    );
  }

  function closeVolunteerModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";

    gsap.killTweensOf(modal);
    gsap.to(modal, {
      scale: 0.95,
      y: 20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    });
  }

  // Intercept triggers to open direct modal instead of external redirect
  openTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      openVolunteerModal();
    });
  });

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeVolunteerModal();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeVolunteerModal();
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
      closeVolunteerModal();
    }
  });

  // Handle Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simulate submission with a high-end animation transition
    gsap.to(form, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      onComplete: () => {
        form.style.display = "none";
        successMsg.classList.add("visible");
        gsap.fromTo(
          successMsg,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
        );
      },
    });
  });
}

function runInit() {
  if (typeof lucide !== "undefined") lucide.createIcons();
  initWelcomeScreen();
}

/* ═══ INIT ═══ */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runInit);
} else {
  runInit();
}
