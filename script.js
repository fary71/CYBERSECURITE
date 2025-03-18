javascript
async function encryptMessage(message, key) {
const encodedKey = new TextEncoder().encode(key);
const cryptoKey = await window.crypto.subtle.importKey(
"raw",
encodedKey,
{ name: "AES-CBC" },
false,
["encrypt"]
);

const iv = window.crypto.getRandomValues(new Uint8Array(16));
const encodedMessage = new TextEncoder().encode(message);
const encryptedMessage = await window.crypto.subtle.encrypt(
{ name: "AES-CBC", iv: iv },
cryptoKey,
encodedMessage
);

return {
iv: Array.from(iv),
data: Array.from(new Uint8Array(encryptedMessage))
};
}

async function decryptMessage(encryptedData, key, iv) {
const encodedKey = new TextEncoder().encode(key);
const cryptoKey = await window.crypto.subtle.importKey(
"raw",
encodedKey,
{ name: "AES-CBC" },
false,
["decrypt"]
);

const decryptedMessage = await window.crypto.subtle.decrypt(
{ name: "AES-CBC", iv: new Uint8Array(iv) },
cryptoKey,
new Uint8Array(encryptedData)
);

return new TextDecoder().decode(decryptedMessage);
}

document.getElementById('encryptBtn').addEventListener('click', async () => {
const message = document.getElementById('message').value;
const key = document.getElementById('key').value;

if (message && key) {
const { iv, data } = await encryptMessage(message, key);
document.getElementById('result').innerText = `Chiffré : ${JSON.stringify({ iv, data })}`;
} else {
alert('Veuillez entrer un message et une clé.');
}
});

document.getElementById('decryptBtn').addEventListener('click', async () => {
const key = document.getElementById('key').value;
const resultText = document.getElementById('result').innerText;

if (key && resultText) {
const { iv, data } = JSON.parse(resultText.replace('Chiffré : ', ''));
const decrypted = await decryptMessage(data, key, iv);
document.getElementById('result').innerText = `Déchiffré : ${decrypted}`;
} else {
alert('Veuillez entrer une clé et avoir un résultat à déchiffrer.');
}
});
