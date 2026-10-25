/* English HTML is the source of truth; JSON keys match normalized English text. */
(() => {
    const languageSwitch = document.getElementById("language-switch");
    const languageButtons = languageSwitch.querySelectorAll("[data-language]");
    const trigger = document.getElementById("language-trigger");
    const options = document.getElementById("language-options");
    const status = document.getElementById("language-status");
    const normalize = (text) => text.replace(/\s+/g, " ").trim();
    const textEntries = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement.closest("script, style, .language-switch, #language-status")) continue;
        const key = normalize(node.nodeValue);
        if (key) textEntries.push({ node, key, original: node.nodeValue });
    }

    const attributeEntries = [];
    document.querySelectorAll("[alt], [title], [aria-label], meta[content]").forEach((element) => {
        if (element.closest(".language-switch")) return;
        const attributes = element.tagName === "META" ? ["content"] : ["alt", "title", "aria-label"];
        attributes.forEach((attribute) => {
            const original = element.getAttribute(attribute);
            if (original) attributeEntries.push({ element, attribute, original });
        });
    });

    const englishTitle = document.title;
    const translations = {};

    function closeDropdown(returnFocus = false) {
        languageSwitch.open = false;
        if (returnFocus) trigger.focus();
    }

    function openDropdown() {
        languageSwitch.open = true;
        options.querySelector('[aria-pressed="true"]').focus();
    }

    languageSwitch.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeDropdown(true);
        } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            if (!languageSwitch.open) { openDropdown(); return; }
            const buttons = Array.from(languageButtons);
            const current = buttons.indexOf(document.activeElement);
            const index = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
                : (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length;
            buttons[index].focus();
        }
    });
    document.addEventListener("click", (event) => {
        if (!languageSwitch.contains(event.target)) closeDropdown();
    });
    languageSwitch.addEventListener("focusout", () => {
        // Check focus after the browser finishes moving it between dropdown items.
        requestAnimationFrame(() => {
            if (!languageSwitch.contains(document.activeElement)) closeDropdown();
        });
    });

    async function setLanguage(language) {
        status.textContent = "";
        languageSwitch.setAttribute("aria-busy", "true");
        languageButtons.forEach((button) => { button.disabled = true; });
        try {
            if (language !== "en" && !translations[language]) {
                const response = await fetch(`./assets/i18n/${language}.json`);
                if (!response.ok) throw new Error("Unable to load translations");
                translations[language] = await response.json();
            }
            const dictionary = language === "en" ? {} : translations[language];
            textEntries.forEach(({ node, key, original }) => {
                node.nodeValue = Object.hasOwn(dictionary, key)
                    ? original.replace(/\S[\s\S]*\S|\S/, () => dictionary[key])
                    : original;
            });
            attributeEntries.forEach(({ element, attribute, original }) => {
                element.setAttribute(attribute, dictionary[original] ?? original);
            });
            document.title = dictionary[englishTitle] ?? englishTitle;
            document.documentElement.lang = language;
            // Refresh slide dimensions after translated copy changes its height.
            document.querySelector(".portfolio__container")?.swiper?.update();
            try {
                localStorage.setItem("selected-language", language);
            } catch {
                // Language switching still works when browser storage is unavailable.
            }
        } catch (error) {
            status.textContent = "Language could not be loaded. Please try again. 语言加载失败，请重试。 Bahasa gagal dimuatkan. Sila cuba lagi.";
            console.error("Language switch failed:", error);
        } finally {
            languageSwitch.setAttribute("aria-busy", "false");
            languageButtons.forEach((button) => {
                button.disabled = false;
                button.setAttribute("aria-pressed", String(button.dataset.language === document.documentElement.lang));
            });
            const selected = options.querySelector('[aria-pressed="true"]');
            trigger.querySelector("img").src = selected.querySelector("img").src;
            trigger.querySelector(".language-switch__current").textContent = selected.dataset.label;
        }
    }

    languageButtons.forEach((button) => {
        button.addEventListener("click", () => {
            closeDropdown(true);
            if (button.dataset.language !== document.documentElement.lang) setLanguage(button.dataset.language);
        });
    });

    try {
        const savedLanguage = localStorage.getItem("selected-language");
        if (["zh-CN", "ms"].includes(savedLanguage)) {
            setLanguage(savedLanguage);
        }
    } catch {
        // Keep the English default when browser storage is unavailable.
    }
})();
