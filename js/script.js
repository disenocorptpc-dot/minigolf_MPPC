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
    const sections = document.querySelectorAll('main > section');

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
                if (targetId === 'home' || targetId === 'legend') targetSection = document.getElementById('story-section');
                else if (targetId === 'characters') targetSection = document.getElementById('characters-section');
                else targetSection = document.getElementById('story-section'); // Default
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
            story: `
                <h3>Barbaján: La Espada del Destino</h3>
                <p>Barbaján fue el hermano mayor, conocido en los siete mares por su fuerza descomunal y su lealtad inquebrantable.</p>
                <p>Desde niño juró proteger a Barbecue. Durante su última travesía, fue él quien se lanzó primero contra el Kraken, blandiendo su espada *Curo*, para dar tiempo a su tripulación de escapar.</p>
                <p>"¡Corran! Yo lo detendré", fueron sus últimas palabras antes de que las olas se lo tragaran.</p>
                <p>Se dice que su espíritu aún vaga por las costas, asegurándose de que ningún otro hermano sea separado por el mar.</p>
            `
        },
        {
            id: "barbecue",
            name: "Barbecue",
            role: "El Guardián Eterno",
            image: "assets/images/barbecue.webp",
            story: `
                <h3>Barbecue: La Espera Eterna</h3>
                <p>Barbecue, el estratega, nunca perdonó al mar por llevarse a Barbaján.</p>
                <p>Construyó un refugio en el arrecife donde naufragaron, esperando día y noche el regreso de su hermano.</p>
                <p>Con el tiempo, su piel se volvió como la corteza de los árboles y sus ojos como brasas. Juró proteger el tesoro que ambos habían encontrado, "El Botín de los 100 años", hasta que Barbaján regresara a reclamarlo junto a él.</p>
            `
        },
        {
            id: "tilin",
            name: "Tilín",
            role: "El Sabio",
            image: "assets/images/tilin.webp",
            story: `
                <h3>Tilín: El Ojo que Todo lo Ve</h3>
                <p>Tilín no es un loro común. Se dice que tiene más de 100 años y que fue el consejero de los mismísimos fundadores de Punta Cana.</p>
                <p>Con sus plumas brillantes y su pico afilado, advierte a los viajeros: "No todo lo que brilla es oro".</p>
                <p>Fue Tilín quien intentó detener a los hermanos antes de entrar a la cueva del Kraken, pero la ambición pudo más que la sabiduría.</p>
            `
        },
        {
            id: "jacky",
            name: "Jacky",
            role: "El Espíritu Libre",
            image: "assets/images/jacky.webp",
            story: `
                <h3>Jacky: La Alegría del Caribe</h3>
                <p>Poco se habla de Jacky en los libros de historia, pero los lugareños saben la verdad.</p>
                <p>Mientras todos buscaban oro, Jacky buscaba la canción perfecta. Se unió a la tripulación no por riqueza, sino por la aventura.</p>
                <p>Su risa era tan contagiosa que incluso las sirenas se detenían a escucharla. Hoy, su espíritu vive en cada fiesta y celebración del minigolf.</p>
            `
        }
    ];

    const charGrid = document.querySelector('.character-grid');
    if (charGrid) {
        charGrid.innerHTML = ''; // Clear existing
        characterData.forEach(char => {
            const card = document.createElement('div');
            card.classList.add('character-card');
            // Adding onclick event to show story
            card.onclick = () => showCharacterStory(char);

            card.innerHTML = `
                <img src="${char.image}" alt="${char.name}" style="width:100%; border-radius: 5px; margin-bottom: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">
                <h3 style="font-family: var(--font-heading); color: var(--color-ink); margin: 10px 0;">${char.name}</h3>
                <p style="font-style: italic; color: var(--color-wax-red);">${char.role}</p>
                <button style="margin-top:10px; padding: 5px 10px; cursor:pointer;">Ver Historia</button>
            `;
            charGrid.appendChild(card);
        });
    }

    // Function to show specific character story in the main scroll view
    window.showCharacterStory = (char) => {
        const storyContent = document.getElementById('dynamic-story-content');
        const storySection = document.getElementById('story-section');
        const sections = document.querySelectorAll('main > section');

        if (storyContent && storySection) {
            // Update content
            storyContent.innerHTML = char.story + '<button onclick="resetStory()" style="display:block; margin: 20px auto; padding: 10px 20px; cursor:pointer;">Volver a la Leyenda Principal</button>';

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
        const storyContent = document.getElementById('dynamic-story-content');
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
    };

});
