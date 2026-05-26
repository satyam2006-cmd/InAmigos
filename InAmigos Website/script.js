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
  initMobileMenu();
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

/* ─── Navbar ─── */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
      if (self.scroll() > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    },
  });

  // Dynamic Scroll Highlighter
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
            .querySelectorAll(".nav-links a, .mobile-nav-link")
            .forEach((link) => {
              link.classList.remove("active");
            });
          const activeNavLinks = document.querySelectorAll(
            `.nav-links a[href="#${id}"], .mobile-nav-link[href="#${id}"]`,
          );
          activeNavLinks.forEach((link) => link.classList.add("active"));
        }
      },
    });
  });
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
  const cards = document.querySelectorAll(".about-detail-card");
  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: "power2.out",
        });
        card.classList.add("visible");
      },
      once: true,
    });
  });
}

/* ─── Projects Grid Animations ─── */
function initHorizontalScroll() {
  const cards = document.querySelectorAll(".project-card");

  // Set initial 3D transform perspective properties
  gsap.set(cards, {
    transformPerspective: 1200,
    transformOrigin: "top center",
  });

  cards.forEach((card, i) => {
    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 90,
        rotationX: -15,
        scale: 0.92,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 1.0,
        ease: "power4.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
        delay: (i % 3) * 0.12,
        onComplete: () => {
          card.classList.add("visible");
        },
      },
    );
  });
}

/* ─── Impact Section ─── */
function initImpactSection() {
  const items = document.querySelectorAll(
    ".impact-card-new, .impact-photo-card",
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
function initEventsSection() {
  const eventCards = document.querySelectorAll(".event-card");
  eventCards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top 88%",
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.15,
          ease: "power2.out",
        });
        card.classList.add("visible");
      },
      once: true,
    });
  });
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

/* ─── Mobile Menu ─── */
function initMobileMenu() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const overlay = document.getElementById("mobile-nav-overlay");
  if (!toggle || !overlay) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.style.overflow = overlay.classList.contains("active")
      ? "hidden"
      : "";
  });

  overlay.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });
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
};

function initProjectModal() {
  const overlay = document.getElementById("project-modal-overlay");
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("project-modal-close");
  const panels = document.querySelectorAll(".project-card");

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
    bar.style.width = scrollPercent + "%";
  });
}

/* ─── FAQ Accordion ─── */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    trigger.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close other FAQ items
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("active");
        }
      });

      // Toggle current FAQ item
      item.classList.toggle("active", !isActive);
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
    '.open-volunteer-trigger, a[href*="volunteers"], #nav-join-btn, #hero-volunteer-btn, #cta-join-btn, #cta-volunteer-btn',
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
