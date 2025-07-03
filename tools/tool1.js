window.addEventListener('DOMContentLoaded', () => {
    const quill = new Quill('#editor', {
        theme: 'snow'
    });

    function resetStats() {
        const statsValues = document.querySelectorAll('.stats .value');
        statsValues.forEach(val => val.textContent = '0');

        renderPlaceholder('kd', '0%');
        renderPlaceholder('tuw', '0');
    }

    function renderPlaceholder(containerId, countValue) {
        const container = document.getElementById(containerId);
        container.querySelectorAll('.value2').forEach(el => el.remove());

        const row = document.createElement('div');
        row.className = 'value2';

        const wordDiv = document.createElement('div');
        wordDiv.className = 'value2_words';
        wordDiv.textContent = '-';

        const countDiv = document.createElement('div');
        countDiv.className = 'value2_count';
        countDiv.textContent = countValue;

        row.appendChild(wordDiv);
        row.appendChild(countDiv);
        container.appendChild(row);
    }

    function updateKeywordDensity(words) {
        const container = document.getElementById('kd');
        container.querySelectorAll('.value2').forEach(el => el.remove());

        if (words.length === 0) {
            renderPlaceholder('kd', '0%');
            return;
        }

        const total = words.length;
        const freq = {};

        words.forEach(word => {
            const clean = word.toLowerCase().replace(/[.,!?;"'()[\]{}]/g, '');
            if (clean) {
                freq[clean] = (freq[clean] || 0) + 1;
            }
        });

        const topWords = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        topWords.forEach(([word, count]) => {
            const percent = ((count / total) * 100).toFixed(1) + '%';

            const row = document.createElement('div');
            row.className = 'value2';

            const wordDiv = document.createElement('div');
            wordDiv.className = 'value2_words';
            wordDiv.textContent = word;

            const countDiv = document.createElement('div');
            countDiv.className = 'value2_count';
            countDiv.textContent = percent;

            row.appendChild(wordDiv);
            row.appendChild(countDiv);
            container.appendChild(row);
        });
    }

    function updateTopUsedWords(words) {
        const container = document.getElementById('tuw');
        container.querySelectorAll('.value2').forEach(el => el.remove());

        if (words.length === 0) {
            renderPlaceholder('tuw', '0');
            return;
        }

        const freq = {};
        words.forEach(word => {
            const clean = word.toLowerCase().replace(/[.,!?;"'()[\]{}]/g, '');
            if (clean) {
                freq[clean] = (freq[clean] || 0) + 1;
            }
        });

        const topWords = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        topWords.forEach(([word, count]) => {
            const row = document.createElement('div');
            row.className = 'value2';

            const wordDiv = document.createElement('div');
            wordDiv.className = 'value2_words';
            wordDiv.textContent = word;

            const countDiv = document.createElement('div');
            countDiv.className = 'value2_count';
            countDiv.textContent = count;

            row.appendChild(wordDiv);
            row.appendChild(countDiv);
            container.appendChild(row);
        });
    }

    function updateStats() {
        const text = quill.getText().trim();

        if (!text) {
            resetStats();
            return;
        }

        const cleanedText = text.replace(/\s+([.,!?;:])/g, '$1');

        const allWords = cleanedText.split(/\s+/).filter(Boolean);
        const wordCount = allWords.length;
        const charsNoSpaces = cleanedText.replace(/\s/g, '').length;

        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const matchedSentences = [...(cleanedText.match(sentenceRegex) || [])].map(s => s.trim());
        const sentenceCount = matchedSentences.length;

        const textUpToLastSentence = matchedSentences.join(' ');
        const wordsInSentences = textUpToLastSentence
            .split(/\s+/)
            .map(w => w.trim())
            .filter(Boolean);
        const sentenceWordsCount = wordsInSentences.length;

        const avgSentenceLength = sentenceCount > 0
            ? Math.round(sentenceWordsCount / sentenceCount)
            : 0;

        const statsValues = document.querySelectorAll('.stats .value');
        if (statsValues.length >= 4) {
            statsValues[0].textContent = wordCount;
            statsValues[1].textContent = charsNoSpaces;
            statsValues[2].textContent = sentenceCount;
            statsValues[3].textContent = avgSentenceLength;
        }

        updateKeywordDensity(allWords);
        updateTopUsedWords(allWords);
    }

    quill.on('text-change', updateStats);
});
