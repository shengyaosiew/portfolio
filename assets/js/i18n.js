/* English HTML is the source of truth; JSON keys match normalized English text. */
(() => {
    const select = document.getElementById("language-select");
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
        const attributes = element.tagName === "META" ? ["content"] : ["alt", "title", "aria-label"];
        attributes.forEach((attribute) => {
            const original = element.getAttribute(attribute);
            if (original) attributeEntries.push({ element, attribute, original });
        });
    });

    const englishTitle = document.title;
    let translations;
    select.value = "en";

    select.addEventListener("change", async () => {
        const language = select.value;
        status.textContent = "";
        select.disabled = true;
        try {
            if (language === "zh-CN" && !translations) {
                const response = await fetch("./assets/i18n/zh-CN.json");
                if (!response.ok) throw new Error("Unable to load translations");
                translations = await response.json();
            }
            const dictionary = language === "zh-CN" ? translations : {};
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
        } catch (error) {
            select.value = document.documentElement.lang;
            status.textContent = "Chinese could not be loaded. Please try again. 中文加载失败，请重试。";
            console.error("Language switch failed:", error);
        } finally {
            select.disabled = false;
        }
    });
})();
