'use strict';

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    handleSelect();
    onClick();
  }
};

// Change form action and method depending on select value
function handleSelect() {
  document.getElementById('select').onchange = function (e) {
    if (e.target.value !== 'addWord') {
      document.getElementById('form').action = '';
      document.getElementById('form').method = '';
    } else {
      document.getElementById('form').action = '/words.json';
      document.getElementById('form').method = 'POST';
    }
  };
}

// Handle API calls
function onClick() {
  document.getElementById('button').addEventListener('click', function (e) {
    if (document.getElementById('select').value !== 'addWord') {
      e.preventDefault();
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById('response').innerHTML = this.responseText;
        } else if (this.readyState == 4 && this.status == 204) {
          document.getElementById('response').innerHTML = 'HTTP/1.1 204 No Content';
        } else {
          document.getElementById('response').innerHTML = this.responseText;
        }
      };
      if (document.getElementById('select').value === 'deleteAll') {
        xhttp.open('DELETE', 'http://localhost:3000/words.json', true);
        xhttp.send();
      } else if (document.getElementById('select').value === 'deleteWord') {
        var deleteWord = document.getElementById('input').value;
        xhttp.open('DELETE', 'http://localhost:3000/words/' + deleteWord + '.json', true);
        xhttp.send();
      } else if (document.getElementById('select').value === 'fetchAnagram') {
        var anagram = document.getElementById('input').value;
        var limit = document.getElementById('limit').value;
        xhttp.open('GET', 'http://localhost:3000/anagrams/' + anagram + '.json?limit=' + limit, true);
        xhttp.send();
      }
    }
  });
}