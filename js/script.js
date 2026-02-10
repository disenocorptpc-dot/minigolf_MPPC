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

            // Map data-target to section ID
            if (!targetSection) {
                if (targetId === 'home') {
                    targetSection = document.getElementById('story-section');
                    if (window.resetStory) window.resetStory();
                }
                else if (targetId === 'map') targetSection = document.getElementById('map-section');
                else if (targetId === 'characters') targetSection = document.getElementById('characters-section');
                // No need for resources fallback if ID matches
            }

            // Special handling for Home/Map/Characters overlay logic
            const tilinOverlay = document.getElementById('tilin-overlay');
            const activeCharDisplay = document.getElementById('active-character-display');
            const storySectionEl = document.getElementById('story-section');

            // Hide active character/story if leaving story view (except if handled by resetStory)
            if (activeCharDisplay) {
                activeCharDisplay.classList.remove('active-character-visible');
                activeCharDisplay.classList.add('hidden-character-display');
            }
            if (storySectionEl) {
                storySectionEl.classList.remove('with-character');
            }

            // Overlay Visibility Logic
            if (tilinOverlay) {
                if (targetId === 'characters' || targetId === 'map') {
                    // Hide Tilin in grid views to avoid clutter
                    tilinOverlay.style.display = 'none';
                } else {
                    // Show Tilin on Home and potentially Resources (unless user says otherwise)
                    tilinOverlay.style.display = 'block';
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
            id: "barbecue",
            name: "Barbecue",
            role: "El Guardián Eterno",
            image: "assets/images/barbecue.webp",
            story: `
                <h3>Barbecue</h3>
                <p>Pirata valiente y amante de la aventura.</p>
                <p>Buscador incansable de grandes tesoros, descubrió que el Botín de los Cien Años le regalo algo aun más valioso que el oro: la amistad de Tilín y la hermandad eterna con Barbaján.</p>
            `
        },
        {
            id: "barbajan",
            name: "Barbaján",
            role: "El Guerrero",
            image: "assets/images/barbajan.webp",
            story: `
                <h3>Barbaján</h3>
                <p>El menor de los dos hermanos, un pirata valiente y de gran corazón.</p>
                <p>Aventurero y generoso, eligió enfrentar solo al Kraken para salvar a su hermano y permitir que la historia continuara.</p>
            `
        },
        {
            id: "tilin",
            name: "Tilín",
            role: "El Sabio",
            image: "assets/images/tilin.webp",
            story: `
                <h3>Tilín</h3>
                <p>Loro sabio del Santuario de los Loros.</p>
                <p>Amigo fiel de Barbecue y su voz de aliento, hoy guía esta aventura para cumplir la promesa de llevar al tesoro a quienes sean dignos de él.</p>
            `
        },
        {
            id: "jacky",
            name: "Jacky",
            role: "La Cazadora",
            image: "assets/images/jacky.webp",
            story: `
                <h3>Jacky, la Cazadora de Tesoros</h3>
                <p>Legendaria pirata de hace un siglo.</p>
                <p>Ruda, bella y astuta, escondió el Botín de los Cien Años, dejando su espíritu y valentía vivos en cada moneda e historia que ha quedado guardada en su tesoro.</p>
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

        const pagControls = document.querySelector('.story-pagination');

        if (storyContent && storySection) {
            // HIDE TILIN OVERLAY
            const tilinOverlay = document.getElementById('tilin-overlay');
            if (tilinOverlay) tilinOverlay.style.display = 'none';

            // Hide Home Pagination
            if (pagControls) pagControls.style.display = 'none';

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



    // --- HOME STORY PAGINATION ---
    const homeStoryPages = [
        `
            <h2>El Botín de los 100 Años</h2>
            <p>Había una vez, en un lejano océano, dos hermanos piratas: Barbaján y Barbecue. Unidos por la sangre y la aventura, navegaron juntos por años en busca de los misterios del mar.</p>
            <p>La leyenda que más los obsesionaba era la del tesoro perdido de Jacky, la Cazadora de Tesoros, quien había escondido su botín más preciado hacía más de un siglo. Se decía que ese tesoro, conocido como el Botín de los Cien Años, había sido alimentado por los restos de quienes morían al buscarlo.</p>
            <p>Un tesoro tan real como letal.</p>
        `,
        `
            <p>Un día, los hermanos encontraron una pista que los trajo hasta esta isla remota. En su travesía, enfrentaron tormentas, sirenas, bestias marinas y peligros indescriptibles. Sin embargo, el mayor desafío fue el encuentro con el temido Kraken.</p>
            <p>Barbaján, el menor, decidió quedarse a luchar contra la criatura para darle tiempo a su hermano de seguir su búsqueda, ya estaban demasiado cerca no podían fallar.</p>
            <p>Barbecue, el mayor, herido y con el corazón roto, juró encontrar el tesoro y esperar a que llegara su hermano a su encuentro. En el difícil camino, conoció a Tilin, un loro sabio del Santuario de los Loros, donde Barbecue encontró refugio. Tilín lo cuidó y se convirtió en su fiel compañero.</p>
        `,
        `
            <p>Pasó el tiempo, y aunque la heridas de Barbecue sanaron por fuera, su alma siguió rota por la ausencia de Barbaján. El cansancio y los años hicieron de lo suyo pero antes de morir, le hizo a Tilin una petición: "Encuentra a mi hermano... o a ese aventurero de buen corazón que merezca este tesoro".</p>
            <p>Tilin, ignorando cual fue destino final de Barbaján, partió con el mapa en su poder. Así comenzó la travesía buscando a quienes escucharían su llamado, para superar cada prueba y demostrar que eran dignos no solo del oro, sino del vínculo que unió a dos hermanos hasta el fin.</p>
            <div style="text-align:center; margin-top:30px; font-size: 2rem;"></div>
        `
    ];
    let currentHomePage = 0;

    window.renderHomePage = (index) => {
        const storyContent = document.getElementById('dynamic-story-content');
        const prevBtn = document.getElementById('prev-page-btn');
        const nextBtn = document.getElementById('next-page-btn');
        const indicator = document.getElementById('page-indicator');

        const pagControls = document.querySelector('.story-pagination');

        if (!storyContent) return;

        storyContent.innerHTML = homeStoryPages[index].replace(/\s+/g, ' '); // Clean excessive whitespace

        // Update Controls
        if (indicator) indicator.textContent = `${index + 1} / ${homeStoryPages.length}`;
        if (prevBtn) prevBtn.style.visibility = index > 0 ? 'visible' : 'hidden';
        if (nextBtn) nextBtn.style.visibility = index < homeStoryPages.length - 1 ? 'visible' : 'hidden';


        // Show pagination controls container explicitly
        if (pagControls) {
            pagControls.style.display = 'flex';
            pagControls.style.justifyContent = 'space-between';
            pagControls.style.alignItems = 'center';
            // Force visibility in case it was hidden
            pagControls.classList.remove('hidden-section');
        }
    };

    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentHomePage > 0) {
                currentHomePage--;
                renderHomePage(currentHomePage);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentHomePage < homeStoryPages.length - 1) {
                currentHomePage++;
                renderHomePage(currentHomePage);
            }
        });
    }

    // --- MAP LOGIC ---
    const mapData = [
        {
            id: "coco",
            title: "Isla de los Cocos",
            content: `
                <h3>Ambiente:</h3>
                <p>Has llegado a la Isla de los Cocos. Aquí comienza la búsqueda del Botín de los Cien Años con mapa, la carta del Pirata Barbecue y un fabuloso guía</p>
                <h3>Tilín:</h3>
                <p>¡Hola! Soy Tilín, guía y consejero de Barbecue. <br>Sígueme… solo los valientes llegan al tesoro.</p>
            `,
            image: "assets/images/map_icons/01_la_carta_en_la_botella.webp"
        },
        {
            id: "calavera",
            title: "Roca Calavera",
            content: `
                 <h3>Advertencia:</h3>
                <p>La Roca Calavera observa a quienes se atreven a pasar.<br>No todo lo que asusta es enemigo.</p>
                 <h3>Tilín:</h3>
                <p>No temas. Estos son ecos del pasado. Parte de la aventura de los hermanos del mar<br>El verdadero peligro aún no aparece.</p>
            `,
            image: "assets/images/map_icons/02_la_roca_calavera.webp"
        },
        {
            id: "kraken",
            title: "El Ataque del Kraken",
            content: `
                 <h3>Advertencia:</h3>
                <p>Una bestia colosal emerge del mar.<br>Si el miedo te detiene, no avanzarás.</p>
                 <h3>Tilín:</h3>
                <p>Aquí Barbaján se quedó a luchar.<br>El coraje abre el camino, no lo olvides.</p>
            `,
            image: "assets/images/map_icons/03_Ataque_Kraken.webp"
        },
        {
            id: "loros",
            title: "El Santuario de los Loros",
            content: `
                 <h3>Ambiente:</h3>
                <p>Un refugio de aves sabias y voces antiguas.<br>Aquí se recuperan fuerzas.</p>
                 <h3>Tilín:</h3>
                <p>Aquí conocí y salvé a Barbecue, el gran pirata<br>La amistad también es un gran tesoro.</p>
            `,
            image: "assets/images/map_icons/04_Templo_loros.webp"
        },
        {
            id: "carga",
            title: "Carga Perdida",
            content: `
                 <h3>Advertencia:</h3>
                <p>Aquí veras un cementerio de cañones, provisiones y recuerdos de quienes no regresaron.<br>Avanza con cuidado.</p>
                 <h3>Tilín:</h3>
                <p>Sigue el camino. Nada te espante, nada te turbe.<br>Cada prueba, por pequeña que sea, te hará más fuerte.</p>
            `,
            image: "assets/images/map_icons/06_Carga_perdida.webp"
        },
        {
            id: "lagartos",
            title: "Cruce de los Lagartos",
            content: `
                 <h3>Advertencia:</h3>
                <p>Ojos atentos y fauces abiertas te rodean.<br>No bajes la guardia. Verde que te quiero verde, pero sin dientes!!!</p>
                 <h3>Tilín:</h3>
                <p>Los enfrentamos juntos…<br>y seguimos adelante.</p>
            `,
            image: "assets/images/map_icons/05_Cruce_lagartos.webp"
        },
        {
            id: "sirena",
            title: "Un Falso Encanto",
            content: `
                 <h3>Advertencia:</h3>
                <p>Un canto hermoso puede llevar al naufragio.<br>No escuches lo que te desvía.</p>
                 <h3>Tilín:</h3>
                <p>Muchos cayeron aquí. Incluyendo a Barbecue<br>¿Resistirás tú?</p>
            `,
            image: "assets/images/map_icons/07_encanto_sirena.webp"
        },
        {
            id: "naufragio",
            title: "El Naufragio del Capitán",
            content: `
                 <h3>Llegada:</h3>
                <p>Has llegado al final del viaje.<br>El tesoro te espera.</p>
                 <h3>Tilín:</h3>
                <p>No es solo oro lo que has ganado.<br>La promesa se ha cumplido.</p>
                <br>
                <h3>Epílogo:</h3>
                <p>El Botín de los Cien Años guarda algo más valioso que el oro:<br>la lealtad, la amistad y el valor de llegar juntos hasta el final</p>
            `,
            image: "assets/images/map_icons/08_Naufragio.webp"
        }
    ];

    // Render Map Grid
    const mapGrid = document.querySelector('.map-grid');
    if (mapGrid) {
        mapGrid.innerHTML = '';
        mapData.forEach(item => {
            const icon = document.createElement('div');
            icon.classList.add('map-icon-container');
            icon.onclick = () => showMapDetail(item);

            icon.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="map-icon-img">
                <div class="map-icon-name">${item.title}</div>
            `;
            mapGrid.appendChild(icon);
        });
    }

    window.showMapDetail = (item) => {
        const storyContent = document.getElementById('dynamic-story-content');
        const storySection = document.getElementById('story-section');
        const activeCharDisplay = document.getElementById('active-character-display');
        const activeCharImg = document.getElementById('active-char-img');
        const sections = document.querySelectorAll('.content-area section');
        const pagControls = document.querySelector('.story-pagination');

        if (storyContent && storySection) {
            // Hide Home Pagination
            if (pagControls) pagControls.style.display = 'none';

            // Set Content
            storyContent.innerHTML = `
                <h2 style="color:var(--color-wax-red); font-family:var(--font-heading);">${item.title}</h2>
                ${item.content}
                <button onclick="returnToMap()" style="display:block; margin: 30px auto; padding: 10px 20px; cursor:pointer; background:var(--color-wax-red); color:white; border:none; border-radius:4px; font-size:1.2rem;">Volver al Mapa</button>
            `;

            // Active Image (The Map Icon, but bigger)
            if (activeCharDisplay && activeCharImg) {
                activeCharImg.src = item.image;
                activeCharDisplay.classList.remove('hidden-character-display');
                activeCharDisplay.classList.add('active-character-visible');
                activeCharDisplay.classList.add('map-detail-active'); // Add specific class for sizing
                // Remove any char-classes
                activeCharDisplay.classList.remove('char-barbajan', 'char-barbecue', 'char-jacky', 'char-tilin');
            }

            // Show Story Section
            sections.forEach(sec => {
                sec.classList.add('hidden-section');
                sec.classList.remove('active-section');
            });
            storySection.classList.remove('hidden-section');
            storySection.classList.add('active-section');
            storySection.classList.add('with-character');
        }
    };

    window.returnToMap = () => {
        const activeCharDisplay = document.getElementById('active-character-display');
        const storySection = document.getElementById('story-section');
        const mapSection = document.getElementById('map-section');

        // Hide Active Image
        if (activeCharDisplay) {
            activeCharDisplay.classList.remove('active-character-visible', 'map-detail-active');
            activeCharDisplay.classList.add('hidden-character-display');
        }

        // Hide Story
        if (storySection) {
            storySection.classList.remove('with-character');
            storySection.classList.add('hidden-section');
            storySection.classList.remove('active-section');
        }

        // Show Map
        if (mapSection) {
            mapSection.classList.remove('hidden-section');
            mapSection.classList.add('active-section');
        }
    };


    window.resetStory = () => {
        const storySection = document.getElementById('story-section');
        const sections = document.querySelectorAll('.content-area section');
        const tilinOverlay = document.getElementById('tilin-overlay');
        const activeCharDisplay = document.getElementById('active-character-display');

        // Show Tilin
        if (tilinOverlay) tilinOverlay.style.display = 'block';

        // Reset Display logic
        if (activeCharDisplay) {
            activeCharDisplay.classList.remove('active-character-visible', 'char-barbajan', 'char-barbecue', 'char-jacky', 'char-tilin', 'map-detail-active');
            activeCharDisplay.classList.add('hidden-character-display');
        }
        if (storySection) {
            storySection.classList.remove('with-character');
        }

        // Switch to Story Section
        sections.forEach(sec => {
            sec.classList.add('hidden-section');
            sec.classList.remove('active-section');
        });
        if (storySection) {
            storySection.classList.remove('hidden-section');
            storySection.classList.add('active-section');
        }

        // Initialize Page 0
        currentHomePage = 0;
        renderHomePage(0);
    };

    // Initialize Home on Load
    window.resetStory();

});
