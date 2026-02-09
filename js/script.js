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
    // Updated selector to find sections even if wrapped in divs
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

            // Hide special active character elements if navigating away from story (or to characters list)
            if (targetId === 'characters') {
                const activeCharDisplay = document.getElementById('active-character-display');
                const storySectionEl = document.getElementById('story-section');
                // HIDE OVERLAY when in characters grid? No, user said "cuando se le da click al personaje... sigue tiling".
                // So in grid it's fine.
                const tilinOverlay = document.getElementById('tilin-overlay');
                if (tilinOverlay) tilinOverlay.style.display = 'block';

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
        const sections = document.querySelectorAll('main > section');

        if (storyContent && storySection) {
            // HIDE TILIN OVERLAY
            const tilinOverlay = document.getElementById('tilin-overlay');
            if (tilinOverlay) tilinOverlay.style.display = 'none';

            // Update content logic for Detail View
            storyContent.innerHTML = char.story + '<button onclick="resetStory()" style="display:block; margin: 30px auto; padding: 10px 20px; cursor:pointer; background:var(--color-wax-red); color:white; border:none; border-radius:4px; font-size:1.2rem;">Volver</button>';

            // Show Active Character Image (Left of Book)
            if (activeCharDisplay && activeCharImg) {
                activeCharImg.src = char.image;
                activeCharDisplay.classList.remove('hidden-character-display');
                activeCharDisplay.classList.add('active-character-visible');
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

    window.resetStory = () => {
        // Reset Logic
        const storyContent = document.getElementById('dynamic-story-content');

        const activeCharDisplay = document.getElementById('active-character-display');
        const storySection = document.getElementById('story-section');
        const sections = document.querySelectorAll('main > section');

        // SHOW TILIN OVERLAY
        const tilinOverlay = document.getElementById('tilin-overlay');
        if (tilinOverlay) tilinOverlay.style.display = 'block';

        // Hide Character Image
        if (activeCharDisplay) {
            activeCharDisplay.classList.remove('active-character-visible');
            activeCharDisplay.classList.add('hidden-character-display');
        }

        // Reset Book Position
        if (storySection) {
            storySection.classList.remove('with-character');
        }

        storyContent.innerHTML = `
            <h2>El Botín de los 100 Años</h2>
            <h3>La Promesa</h3>
            <p>El Botín de los Cien Años es real... Dos hermanos, Barbaján y Barbecue, juraron encontrar el tesoro más grande jamás visto. Pero el mar guarda secretos oscuros.</p>
            <h3>Los Peligros del Mar</h3>
            <p>Tilin nos advirtió: "La belleza es como un amanecer, pero lleva a la perdición." Sirenas encantadoras y el temible Kraken aguardaban en las profundidades, custodiando el camino.</p>
            <h3>El Naufragio</h3>
            <p>Llegada al destino: Aquí está su barco y el tesoro está dentro. El viaje ha terminado.</p>
            <p>Tras una feroz batalla contra el Kraken, el barco sucumbió. Barbaján no pudo sobrevivir, y Barbecue, en su espera eterna, también falleció.</p> 
            <p>Inspirado por su promesa, he encontrado en ti un nuevo compañero digno de llevarse este tesoro: el valor de la amistad.</p>
            <h3>Epílogo</h3>
            <p>El Botín de los Cien Años es real, sí... Pero también es la fuerza que unió a dos hermanos hasta el último aliento. Hoy, por fin, se cumple la promesa.</p>
            <p>Y si has llegado hasta aquí, quizás tú también lo entiendas: la verdadera riqueza es la amistad que ni el tiempo ni la muerte pueden borrar.</p>
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
