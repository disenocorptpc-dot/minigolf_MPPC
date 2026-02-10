document.addEventListener('DOMContentLoaded', () => {
    // --- Audio Logic ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isPlaying = false;

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                musicToggle.textContent = '🔇';
            } else {
                bgMusic.play().catch(e => console.log('Audio play failed:', e));
                musicToggle.textContent = '🔊';
            }
            isPlaying = !isPlaying;
        });
    }

    // --- Navigation Logic ---
    const navRibbons = document.querySelectorAll('.nav-ribbon');
    // Updated selector to find sections even if wrapped in divs (fixes nested section visibility bug)
    const sections = document.querySelectorAll('.content-area section');

    navRibbons.forEach(ribbon => {
        ribbon.addEventListener('click', () => {
            const targetId = ribbon.getAttribute('data-target');
            console.log('Navigating to:', targetId);

            // Hide all sections
            sections.forEach(sec => {
                sec.classList.add('hidden-section');
                sec.classList.remove('active-section');
            });

            // Show target section
            let targetSection = document.getElementById(targetId + '-section');



            // Fallback for simple mapping
            if (!targetSection) {
                if (targetId === 'home' || targetId === 'legend') {
                    targetSection = document.getElementById('story-section');
                    // Ensure story is reset to intro when clicking home/legend
                    if (window.resetStory) window.resetStory();

                    // SHOW OVERLAY when going home
                    const tilinOverlay = document.getElementById('tilin-overlay');
                    if (tilinOverlay) tilinOverlay.style.display = 'block';
                }
                else if (targetId === 'characters') targetSection = document.getElementById('characters-section');
                else targetSection = document.getElementById('story-section'); // Default
            }


            // Hide special active character elements if navigating away from story (or to characters/resources)
            if (targetId === 'characters' || targetId === 'resources') {
                const activeCharDisplay = document.getElementById('active-character-display');
                const storySectionEl = document.getElementById('story-section');

                // Hide TILIN OVERLAY when in characters to prevent overlap with Barabajan
                // BUT show it in resources?
                const tilinOverlay = document.getElementById('tilin-overlay');
                if (targetId === 'characters') {
                    if (tilinOverlay) tilinOverlay.style.display = 'none';
                } else {
                    // Resources: Show Tilin
                    if (tilinOverlay) tilinOverlay.style.display = 'block';
                }

                if (activeCharDisplay) {
                    activeCharDisplay.classList.remove('active-character-visible');
                    activeCharDisplay.classList.add('hidden-character-display');
                }
                if (storySectionEl) {
                    storySectionEl.classList.remove('with-character');
                }
            }


            if (targetSection) {
                targetSection.classList.remove('hidden-section');
                targetSection.classList.add('active-section');
            }
        });
    });

    // --- Story Scroll Logic (Optional: simple fade in) ---
    const storySection = document.getElementById('story-section');
    if (storySection) {
        // Just ensuring it's visible by default
        storySection.classList.add('active-section');
    }


    // --- Character List & Data ---
    const characterData = [
        {
            id: "barbajan",
            name: "Barbaján",
            role: "El Guerrero",
            image: "assets/images/barbajan.webp",
            // Reduced story text for fitting better
            story: `
                <h3>Barbaján: La Espada del Destino</h3>
                <p>El hermano mayor, legendario por su fuerza y lealtad. Juró proteger a Barbecue desde niño.</p>
                <p>En su última batalla, se enfrentó solo al Kraken con su espada *Curo*, sacrificándose para salvar a su tripulación.</p>
                <p>Su espíritu ahora protege estas costas.</p>
            `
        },
        {
            id: "barbecue",
            name: "Barbecue",
            role: "El Guardián Eterno",
            image: "assets/images/barbecue.webp",
            story: `
                <h3>Barbecue: La Espera Eterna</h3>
                <p>El estratega que nunca perdonó al mar. Construyó un refugio en el arrecife esperando a su hermano.</p>
                <p>Con el tiempo, se convirtió en parte de la isla, custodiando el "Botín de los 100 años" hasta el regreso de Barbaján.</p>
            `
        },
        {
            id: "tilin",
            name: "Tilín",
            role: "El Sabio",
            image: "assets/images/tilin.webp",
            story: `
                <h3>Tilín: El Ojo que Todo lo Ve</h3>
                <p>Más de 100 años de sabiduría plumífera. Consejero de los fundadores y guardián de secretos.</p>
                <p>Advirtió sobre el Kraken, pero la ambición humana es sorda. Hoy vigila que la historia no se repita con nuevos aventureros.</p>
            `
        },
        {
            id: "jacky",
            name: "Jacky",
            role: "El Espíritu Libre",
            image: "assets/images/jacky.webp",
            story: `
                <h3>Jacky: La Alegría del Caribe</h3>
                <p>Mientras otros buscaban oro, ella buscaba la canción perfecta. Su risa encantaba hasta a las sirenas.</p>
                <p>No busca tesoros, sino la próxima gran historia. ¿Serás tú parte de ella?</p>
            `
        }
    ];

    const charGrid = document.querySelector('.character-grid');
    if (charGrid) {
        charGrid.innerHTML = ''; // Clear existing
        characterData.forEach(char => {
            const card = document.createElement('div');
            card.classList.add('character-card');
            // Adding onclick to ALL elements inside card
            card.onclick = () => showCharacterStory(char);

            card.innerHTML = `
                <img src="${char.image}" alt="${char.name}">
                <h3>${char.name}</h3>
                <p>${char.role}</p> <!-- Hidden by CSS -->
                <button>Ver Historia</button> <!-- Hidden by CSS -->
            `;
            charGrid.appendChild(card);
        });
    }

    // Function to show specific character story in the main scroll view
    window.showCharacterStory = (char) => {
        const storyContent = document.getElementById('dynamic-story-content');
        const storySection = document.getElementById('story-section');


        const activeCharDisplay = document.getElementById('active-character-display');
        const activeCharImg = document.getElementById('active-char-img');
        const sections = document.querySelectorAll('.content-area section');


        // RESET Active Character Classes to prevent bleed-over
        if (activeCharDisplay) {
            activeCharDisplay.classList.remove('char-barbajan', 'char-barbecue', 'char-jacky', 'char-tilin');
        }

        if (storyContent && storySection) {
            // HIDE TILIN OVERLAY
            const tilinOverlay = document.getElementById('tilin-overlay');
            if (tilinOverlay) tilinOverlay.style.display = 'none';

            // Update content logic for Detail View with "returnToCharacters()"
            storyContent.innerHTML = char.story + '<button onclick="returnToCharacters()" style="display:block; margin: 30px auto; padding: 10px 20px; cursor:pointer; background:var(--color-wax-red); color:white; border:none; border-radius:4px; font-size:1.2rem;">Volver</button>';

            // Show Active Character Image (Left of Book)
            if (activeCharDisplay && activeCharImg) {
                activeCharImg.src = char.image;
                activeCharDisplay.classList.remove('hidden-character-display');
                activeCharDisplay.classList.add('active-character-visible');

                // Add specific class for per-character styling (Barbajan fix)
                if (char.id) {
                    activeCharDisplay.classList.add(`char-${char.id}`);
                }

                // Shift book to right
                storySection.classList.add('with-character');
            }

            // Navigate to story section
            sections.forEach(sec => {
                sec.classList.add('hidden-section');
                sec.classList.remove('active-section');
            });
            storySection.classList.remove('hidden-section');
            storySection.classList.add('active-section');
        }
    };


    window.returnToCharacters = () => {
        const activeCharDisplay = document.getElementById('active-character-display');
        const storySection = document.getElementById('story-section');
        const charsSection = document.getElementById('characters-section');
        const tilinOverlay = document.getElementById('tilin-overlay');

        // Hide Active Character Image
        if (activeCharDisplay) {
            activeCharDisplay.classList.remove('active-character-visible');
            activeCharDisplay.classList.add('hidden-character-display');
        }

        // Reset Book layout
        if (storySection) {
            storySection.classList.remove('with-character');
            storySection.classList.add('hidden-section');
            storySection.classList.remove('active-section');
        }

        // Show Characters Section
        if (charsSection) {
            charsSection.classList.remove('hidden-section');
            charsSection.classList.add('active-section');
        }

        // Keep Tilin HIDDEN in characters section
        if (tilinOverlay) tilinOverlay.style.display = 'none';
    };

    window.resetStory = () => {

        // Reset Logic
        const storyContent = document.getElementById('dynamic-story-content');


        const activeCharDisplay = document.getElementById('active-character-display');
        const storySection = document.getElementById('story-section');
        const sections = document.querySelectorAll('.content-area section');

        // SHOW TILIN OVERLAY
        const tilinOverlay = document.getElementById('tilin-overlay');
        if (tilinOverlay) tilinOverlay.style.display = 'block';

        // Hide Character Image
        if (activeCharDisplay) {
            activeCharDisplay.classList.remove('active-character-visible', 'char-barbajan', 'char-barbecue', 'char-jacky', 'char-tilin');
            activeCharDisplay.classList.add('hidden-character-display');
        }

        // Reset Book Position
        if (storySection) {
            storySection.classList.remove('with-character');
        }

        storyContent.innerHTML = `
            <h2>El Botín de los 100 Años</h2>
            <p>Había una vez, en un lejano océano, dos hermanos piratas: Barbaján y Barbecue.</p>
            <p>Unidos por la sangre y la aventura, navegaron juntos por años en busca de los misterios del mar. La leyenda que más los obsesionaba era la del tesoro perdido de Jacky, la Cazadora de Tesoros, quien había escondido su botín más preciado hacía más de un siglo. Se decía que ese tesoro, conocido como el Botín de los Cien Años, había sido alimentado por los restos de quienes morían al buscarlo.</p>
            <p>Un tesoro tan real como letal.</p>
            <p>Un día, los hermanos encontraron una pista que los trajo hasta esta isla remota. En su travesía, enfrentaron tormentas, sirenas, bestias marinas y peligros indescriptibles. Sin embargo, el mayor desafío fue el encuentro con el temido Kraken.</p>
            <p>Barbaján, el menor, decidió quedarse a luchar contra la criatura para darle tiempo a su hermano de seguir su búsqueda, ya estaban demasiado cerca no podían fallar.</p>
            <p>Barbecue, el mayor, herido y con el corazón roto, juró encontrar el tesoro y esperar a que llegara su hermano a su encuentro. En el difícil camino, conoció a Tilin, un loro sabio del Santuario de los Loros, donde Barbecue encontró refugio. Tilín lo cuidó y se convirtió en su fiel compañero.</p>
            <p>Pasó el tiempo, y aunque la heridas de Barbecue sanaron por fuera, su alma siguió rota por la ausencia de Barbaján. El cansancio y los años hicieron de lo suyo pero antes de morir, le hizo a Tilin una petición: "Encuentra a mi hermano... o a ese aventurero de buen corazón que merezca este tesoro".</p>
            <p>Tilin, ignorando cual fue destino final de Barbaján, partió con el mapa en su poder. Así comenzó la travesía buscando a quienes escucharían su llamado, para superar cada prueba y demostrar que eran dignos no solo del oro, sino del vínculo que unió a dos hermanos hasta el fin.</p>
            <div style="text-align:center; margin-top:30px; font-size: 2rem;">☠️ 🦜 ☠️</div>
        `;

        // Ensure we are on the story section (Home)
        sections.forEach(sec => {
            sec.classList.add('hidden-section');
            sec.classList.remove('active-section');
        });
        if (storySection) {
            storySection.classList.remove('hidden-section');
            storySection.classList.add('active-section');
        }
    };

});
