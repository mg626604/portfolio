/**
 * 3D Interactive Portfolio Engine
 * Author: Manikandan G
 * Stack: Three.js, GSAP, ScrollTrigger
 */

// Global Variables
let scene, camera, renderer;
let particleMesh, contactSphere, driftParticles;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// Initialize Experience
function init() {
    const canvas = document.getElementById('webgl-canvas');

    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;


    // 3. Renderer Setup
    try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
        console.error("WebGL not supported", e);
        document.getElementById('webgl-fallback').classList.remove('hidden');
        return;
    }

    // 4. Create 3D Objects
    createHeroParticleCloud();
    createDriftParticleStream();
    createContactSphere();
    setupLighting();

    // 5. Event Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);
    // pointer trail removed — keep mouse tracking for parallax only

    // 6. Register GSAP & Tilt Interactions
    initGSAPScrollAnimations();
    init3DTiltCards();
    initButtonHoverEffects();
    initCursorGlow();
    initTypedIntro();
    initProjectModals();
    initBadgeAnimations();
    initGlassHoverEffects();

    // 7. Start Render Loop
    animate();
}

/* --- PROJECT DETAILS MODAL HANDLING --- */
function initProjectModals() {
    const modalOverlay = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modalOverlay && modalOverlay.querySelector('.modal-close');

    const projects = {
        'thermal-optimization': {
            title: 'Thermal Optimization & Energy Simulation of Bio-Composite Walls',
            body: `
                <img src="images/thermal-wall.jpeg" alt="Thermal Optimization Project Image" onerror="this.onerror=null; this.src='images/thermal-wall.svg';">
                <h3>2. Thermal Optimization & Energy Simulation of Bio-Composite Building Walls</h3>
                <p><strong>Project Summary:</strong> Developed and modeled a sustainable multi-layer composite wall incorporating a 40:60 Cement–Water Hyacinth bio-insulation panel alongside industrial Glass Wool. The design was validated for a 50 m² office space in Thiruvananthapuram, Kerala, to minimize building heat gain and reduce HVAC energy demand in tropical climates.</p>
                <p><strong>Key Methodology:</strong></p>
                <ul>
                    <li>Formulated an eco-friendly bio-insulation panel using Cement–Water Hyacinth composite with thermal conductivity <strong>k = 0.075 W/m·K</strong>.</li>
                    <li>Paired the bio-composite layer with Glass Wool insulation (<strong>k = 0.045 W/m·K</strong>) to create a high-performance multi-layer wall assembly.</li>
                    <li>Performed steady-state FEM thermal simulations in ANSYS Workbench to evaluate heat flux and temperature gradients across conventional vs. composite wall configurations.</li>
                    <li>Conducted full-building annual energy modeling using OpenStudio and EnergyPlus with localized EPW weather data for the tropical climate of Kerala.</li>
                </ul>
                <p><strong>Results & Key Achievements:</strong></p>
                <ul>
                    <li><strong>76% Heat Flux Reduction:</strong> Lowered wall thermal heat flux from <strong>73.16 W/m²</strong> for the conventional concrete wall to <strong>17.59 W/m²</strong> in the final composite design.</li>
                    <li><strong>27.8% Annual Energy Savings:</strong> Reduced total building site energy from <strong>14,592 kWh/year</strong> (EUI: 291.83 kWh/m²) to <strong>10,525 kWh/year</strong> (EUI: 210.50 kWh/m²).</li>
                    <li><strong>Economic Impact:</strong> Estimated annual electricity savings of approximately <strong>₹35,383</strong> per 50 m² office space using local commercial tariffs.</li>
                    <li><strong>Software & Tools:</strong> ANSYS Workbench (Steady-State Thermal), OpenStudio, EnergyPlus, EPW Weather Data Analysis.</li>
                </ul>
            `
        },
        'water-quality-monitoring': {
            title: 'Real-Time TDS Water Quality Monitoring System',
            body: `
                <img src="images/water-quality.jpeg" alt="Water Quality Monitoring Project Image" onerror="this.onerror=null; this.src='images/water-quality.svg';">
                <h3>3. Real-Time TDS Water Quality Monitoring System</h3>
                <p><strong>Project Summary:</strong> Designed and prototyped a portable digital water quality testing device to deliver instant Total Dissolved Solids (TDS) measurements for household and field applications. The system uses an Arduino Uno, Gravity TDS sensor, and OLED display to provide accurate, real-time ppm readouts.</p>
                <p><strong>Key Methodology:</strong></p>
                <ul>
                    <li>Programmed an Arduino Uno to read analog outputs from the Gravity TDS sensor and convert them into calibrated concentration values.</li>
                    <li>Implemented signal processing algorithms to translate raw voltage into Total Dissolved Solids (ppm) with improved measurement accuracy.</li>
                    <li>Integrated a 0.96" OLED display for dynamic visual feedback and easy field readability.</li>
                    <li>Designed a compact, portable enclosure for reliable circuit protection and user-friendly operation.</li>
                </ul>
                <p><strong>Results & Key Achievements:</strong></p>
                <ul>
                    <li>Delivered a functional low-power embedded prototype capable of real-time water purity assessment.</li>
                    <li>Produced an affordable alternative to laboratory-grade water-testing equipment for domestic and field use.</li>
                    <li>Demonstrated the complete hardware-software integration required for reliable, portable water quality monitoring.</li>
                    <li><strong>Tools & Technologies:</strong> Arduino IDE (C/C++), Arduino Uno, Gravity TDS Sensor, OLED Display, CAD Enclosure Design.</li>
                </ul>
            `
        },
        'material-optimization': {
            title: 'Material Optimization & Life Extension — Coconut Husk Peeler',
            body: `
                <img src="images/material-optimization.jpeg" alt="Material Optimization Project Image" onerror="this.onerror=null; this.src='images/material-optimization.svg';">
                <h3>1. Material Optimization & Life Extension of a Coconut Husk Peeler Component</h3>
                <p><strong>Project Summary:</strong> Investigated and implemented the material replacement of conventional Mild Steel (MS) with Stainless Steel (SS316) for the critical peeling tip of a coconut husk peeler machine. The objective was to eliminate tip bending, plastic deformation, and premature mechanical failure caused by continuous impact loads and exposure to humid/saline environments in agricultural processing.</p>
                <p><strong>Key Methodology:</strong></p>
                <ul>
                    <li>Conducted experimental comparative analysis between Mild Steel and SS316.</li>
                    <li>Microstructure evaluation using optical metallurgy to analyze grain phases (ferrite-pearlite vs. uniform austenitic grains).</li>
                    <li>Hardness evaluation via Rockwell Hardness Testing.</li>
                    <li>Tensile and yield strength testing on a Universal Testing Machine (UTM) at a 20 kN/min load rate.</li>
                    <li>Accelerated corrosion testing by exposing samples to a 5% NaCl solution to quantify mass loss and surface degradation.</li>
                </ul>
                <p><strong>Results & Key Achievements:</strong></p>
                <ul>
                    <li><strong>25% Increase in Hardness:</strong> SS316 achieved an average hardness of <strong>86.6 BHN</strong> vs. <strong>69.2 BHN</strong> for Mild Steel, significantly boosting surface wear resistance.</li>
                    <li><strong>Enhanced Structural Rigidity:</strong> Yield strength increased from <strong>378.60 MPa to 443.23 MPa</strong>, preventing permanent bending of the cutter tip under heavy stress.</li>
                    <li><strong>Superior Corrosion Resistance:</strong> SS316 exhibited over <strong>100× lower corrosion rate</strong> than Mild Steel, maintaining surface integrity with only <strong>0.009% mass loss</strong> (compared to 2.40% mass loss and heavy rusting on Mild Steel).</li>
                </ul>
                <p><strong>Key Tools & Testing Standards:</strong> Universal Testing Machine (UTM), Rockwell Hardness Tester, Metallurgical Microscope, ASTM E8/E8M, ISO 6506.</p>
            `
        }
    };

    document.querySelectorAll('.project-title').forEach(title => {
        title.addEventListener('click', () => {
            const id = title.getAttribute('data-project');
            const project = projects[id];
            if (!project) return;
            modalTitle.innerText = project.title;
            modalBody.innerHTML = project.body;
            modalOverlay.classList.remove('hidden');
            modalOverlay.setAttribute('aria-hidden', 'false');
        });
        title.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                title.click();
            }
        });
    });

    function closeModal() {
        modalOverlay.classList.add('hidden');
        modalOverlay.setAttribute('aria-hidden', 'true');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

/* --- LIGHTWEIGHT CURSOR GLOW (shows only on interactive hovers) --- */
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    const hoverTargets = document.querySelectorAll('.interactive-btn, .project-card, [data-tilt], .nav-links a');
    let active = false;

    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => { active = true; glow.classList.add('visible'); });
        el.addEventListener('mouseleave', () => { active = false; glow.classList.remove('visible'); });
    });

    document.addEventListener('mousemove', (e) => {
        if (!active) return;
        // position with transforms for better performance
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(1)`;
    });
}

/* --- TYPED INTRO FOR HERO TAGLINE --- */
function initTypedIntro() {
    const elem = document.querySelector('.tagline');
    if (!elem) return;
    const fullText = elem.textContent.trim();
    elem.textContent = '';
    elem.classList.add('typing');
    let i = 0;
    const speed = 28; // ms per character

    function step() {
        if (i <= fullText.length) {
            elem.textContent = fullText.slice(0, i);
            i++;
            setTimeout(step, speed + (i % 8 === 0 ? 18 : 0));
        } else {
            elem.classList.remove('typing');
        }
    }
    // small delay so it doesn't start immediately on load
    setTimeout(step, 420);
}

/* --- BADGE FLOAT ANIMATIONS (GSAP) --- */
function initBadgeAnimations() {
    if (typeof gsap === 'undefined') return;
    const badges = document.querySelectorAll('.skill-badge');
    if (!badges || badges.length === 0) return;

    gsap.to(badges, {
        y: '-=8',
        rotationZ: 2,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: {
            each: 0.18,
            from: 'center'
        }
    });
}

/* Mini 3D scenes removed — using CSS/JS tilt for project cards instead. */

/* --- 3D OBJECT CREATION --- */

// Hero Abstract Wireframe / Particle Cloud
function createHeroParticleCloud() {
    const count = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorCyan = new THREE.Color(0x00f3ff);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < count * 3; i += 3) {
        // Sphere distribution formula
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 18;

        positions[i] = r * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        // Mix cyan and white particles
        const mixedColor = Math.random() > 0.6 ? colorCyan : colorWhite;
        colors[i] = mixedColor.r;
        colors[i + 1] = mixedColor.g;
        colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particleMesh = new THREE.Points(geometry, material);
    scene.add(particleMesh);
}

// Contact Section Morphing Sphere
function createContactSphere() {
    const geometry = new THREE.IcosahedronGeometry(6, 3);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00f3ff,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.6
    });

    contactSphere = new THREE.Mesh(geometry, material);
    contactSphere.position.set(0, -60, -10); // Positioned down at the contact section
    scene.add(contactSphere);
}

function createDriftParticleStream() {
    const count = 320;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i + 1] = (Math.random() - 0.5) * 90;
        positions[i + 2] = (Math.random() - 0.5) * 120;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.14,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending
    });

    driftParticles = new THREE.Points(geometry, material);
    driftParticles.position.set(0, 0, -20);
    scene.add(driftParticles);
}

// Lighting Setup
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 2, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
}

/* --- INTERACTIVE EVENTS & ANIMATIONS --- */

function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;

    // no DOM pointer updates here — we still capture mouse for 3D parallax
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // No per-card 3D renderers to update.
}

// 3D Card Tilt Effect
function init3DTiltCards() {
    const cards = document.querySelectorAll('.project-card, [data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate tilt angles
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // CSS Custom Properties for cursor lighting glow
            card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
}

// Button Hover Interactions with 3D Sphere
function initButtonHoverEffects() {
    const buttons = document.querySelectorAll('.interactive-btn');

    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (contactSphere) {
                // Morph material color to neon green on hover
                gsap.to(contactSphere.material.color, {
                    r: 0, g: 1, b: 0.53, duration: 0.5
                });
                gsap.to(contactSphere.scale, {
                    x: 1.3, y: 1.3, z: 1.3, duration: 0.5
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (contactSphere) {
                // Revert color back to neon electric cyan
                gsap.to(contactSphere.material.color, {
                    r: 0, g: 0.95, b: 1, duration: 0.5
                });
                gsap.to(contactSphere.scale, {
                    x: 1, y: 1, z: 1, duration: 0.5
                });
            }
        });
    });
}

/* --- GLASS HOVER POLISH (GSAP) --- */
function initGlassHoverEffects() {
    if (typeof gsap === 'undefined') return;
    const targets = document.querySelectorAll('.project-card, .card, .report-card, .focus-card, .skill-badge');
    if (!targets || targets.length === 0) return;

    targets.forEach(el => {
        const glow = el.querySelector('.card-glow');
        el.addEventListener('mouseenter', () => {
            gsap.killTweensOf(el);
            gsap.to(el, { scale: 1.035, boxShadow: '0 40px 90px rgba(0,243,255,0.08)', duration: 0.42, ease: 'power3.out' });
            if (glow) gsap.to(glow, { opacity: 0.95, scale: 1.06, duration: 0.6, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { scale: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.12)', duration: 0.42, ease: 'power3.inOut' });
            if (glow) gsap.to(glow, { opacity: 0, scale: 0.92, duration: 0.6, ease: 'power3.inOut' });
        });
    });
}

/* --- GSAP SCROLLTRIGGER SYSTEM --- */

function initGSAPScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Horizontal Scroll Showcase
    const scrollContainer = document.querySelector('.horizontal-scroll-container');
    const scrollWidth = scrollContainer.scrollWidth - window.innerWidth + 100;
    const cards = scrollContainer ? scrollContainer.querySelectorAll('.project-card') : [];
    const totalCards = cards.length || 1;
    const snapStep = totalCards > 1 ? 1 / (totalCards - 1) : 1;

    gsap.to(scrollContainer, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
            trigger: ".work-section",
            pin: true,
            scrub: 1,
            end: () => "+=" + scrollWidth,
            snap: {
                snapTo: snapStep,
                duration: 0.6,
                ease: "power2.out"
            }
        }
    });

    // 2. Camera Movement along page scroll
    gsap.to(camera.position, {
        z: 15,
        scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });

    gsap.to(camera.position, {
        y: -60, // Move down to align with contactSphere
        scrollTrigger: {
            trigger: "#contact",
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1
        }
    });
}

/* --- RENDER LOOP --- */

function animate() {
    requestAnimationFrame(animate);

    // Smooth Mouse Tracking Parallax (Lerp)
    targetMouseX += (mouseX - targetMouseX) * 0.05;
    targetMouseY += (mouseY - targetMouseY) * 0.05;

    // Rotate Hero Particle Cloud
    if (particleMesh) {
        particleMesh.rotation.y += 0.001;
        particleMesh.rotation.x += 0.0005;

        // Apply Parallax Shift
        particleMesh.rotation.y += targetMouseX * 0.05;
        particleMesh.rotation.x += targetMouseY * 0.05;
    }

    // Rotate Contact Sphere
    if (contactSphere) {
        contactSphere.rotation.x += 0.005;
        contactSphere.rotation.y += 0.008;
    }

    if (driftParticles) {
        driftParticles.rotation.y += 0.0009;
        driftParticles.position.x = Math.sin(Date.now() * 0.00015) * 2;
        driftParticles.position.y = Math.cos(Date.now() * 0.00012) * 1.5;
    }

    // No per-card 3D rendering; project cards use CSS/JS tilt instead.

    renderer.render(scene, camera);
}

// Start application after DOM loads
window.addEventListener('DOMContentLoaded', init);