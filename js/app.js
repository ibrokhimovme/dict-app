const words = JSON.parse(localStorage.getItem('words')) || [];

function showAddWordForm() {
  hideSections();
  document.getElementById('add-word-form').style.display = 'block';
}

function showWordList() {
  hideSections();
  document.getElementById('word-list').style.display = 'block';
  renderWordList();
}

function showTest() {
  if (words.length === 0) {
    alert("Test uchun avval so'zlar qo'shishingiz kerak!");
    return;
  }
  hideSections();
  document.getElementById('test-section').style.display = 'block';
  renderTest();
}

function hideSections() {
  document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
}

function addWord() {
  const englishWord = document.getElementById('englishWord').value.trim();
  const uzbekWord = document.getElementById('uzbekWord').value.trim();

  if (englishWord && uzbekWord) {
    words.push({ english: englishWord, uzbek: uzbekWord });
    localStorage.setItem('words', JSON.stringify(words));
    document.getElementById('englishWord').value = '';
    document.getElementById('uzbekWord').value = '';
    alert("So'z qo'shildi!");
  } else {
    alert("Iltimos, barcha maydonlarni to'ldiring!");
  }
}

function renderWordList() {
  const wordList = document.getElementById('wordList');
  wordList.innerHTML = '';

  if (words.length === 0) {
    wordList.innerHTML = "<li>So'z qo'shilmagan</li>";
  } else {
    words.forEach((word, index) => {
      const li = document.createElement('li');
      li.textContent = `${word.english} - ${word.uzbek}`;
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'O\'chirish';
      deleteBtn.onclick = () => deleteWord(index);
      li.appendChild(deleteBtn);
      wordList.appendChild(li);
    });
  }
}

function deleteWord(index) {
  words.splice(index, 1);
  localStorage.setItem('words', JSON.stringify(words));
  renderWordList();
}

function deleteAllWords() {
  if (confirm("Barcha so'zlarni o'chirishni istaysizmi?")) {
    localStorage.removeItem('words');
    renderWordList();
  }
}

// Testni render qilish funksiyasi
function renderTest() {
  const testList = document.getElementById('testList');
  testList.innerHTML = '';

  // So'zlar soni 20 tadan kam bo'lsa, barcha so'zlarni olamiz. Aks holda, random 20 ta tanlaymiz.
  const wordsForTest = words.length <= 20 ? words : getRandomWords(20);

  wordsForTest.forEach((word, index) => {
    const li = document.createElement('li');
    li.textContent = word.english;

    const input = document.createElement('input');
    input.type = 'text';
    input.dataset.index = index;
    li.appendChild(input);

    testList.appendChild(li);
  });
}

// 20 ta random so'zni olish uchun yordamchi funksiya
function getRandomWords(count) {
  const shuffledWords = [...words].sort(() => 0.5 - Math.random());
  return shuffledWords.slice(0, count);
}

function finishTest() {
  let correct = 0;
  let total = words.length < 20 ? words.length : 20;

  document.querySelectorAll('#testList input').forEach(input => {
    const index = input.dataset.index;
    const word = words[index];
    if (input.value.trim().toLowerCase() === word.uzbek.toLowerCase()) {
      correct++;
      input.style.backgroundColor = 'lightgreen';
    } else {
      input.style.backgroundColor = 'lightcoral';
    }
    input.disabled = true;
  });

  document.getElementById('finishTest').disabled = true;
  alert(`Test natijalari: ${((correct / total) * 100).toFixed(2)}%`);
  resetToStart();
}

function resetToStart() {
  setTimeout(() => {
    document.getElementById('finishTest').disabled = false;
    showAddWordForm();
  }, 2000);
}
