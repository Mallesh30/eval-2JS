const fileIcons = {
  ".txt": "https://via.placeholder.com/200?text=TXT",
  ".pdf": "https://via.placeholder.com/200?text=PDF",
  ".mp3": "https://via.placeholder.com/200?text=MP3",
  ".exe": "https://via.placeholder.com/200?text=EXE",
  ".rar": "https://via.placeholder.com/200?text=RAR",
  ".docx": "https://via.placeholder.com/200?text=DOCX",
  ".jpg": "https://via.placeholder.com/200?text=JPG",
  ".png": "https://via.placeholder.com/200?text=PNG",
  ".gif": "https://via.placeholder.com/200?text=GIF",
  ".zip": "https://via.placeholder.com/200?text=ZIP",
};

const files = [
  "document1.txt",
  "presentation1.pdf",
  "song1.mp3",
  "installer1.exe",
  "archive1.rar",
];

const fileContainer = document.getElementById("files");
const binContainer = document.getElementById("bin");
const modal = document.getElementById("confirmationModal");
const modalMessage = document.getElementById("modalMessage");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
let currentFileToDelete = null;
let bin = JSON.parse(localStorage.getItem("bin")) || [];

function displayFiles() {
  fileContainer.innerHTML = "";
  files.forEach((file) => {
    const fileExtension = file.slice(file.lastIndexOf("."));
    const fileName = file.slice(0, file.lastIndexOf("."));
    const iconURL =
      fileIcons[fileExtension] || "https://via.placeholder.com/200?text=FILE";

    const fileItem = document.createElement("div");
    fileItem.className = "file-item";
    fileItem.innerHTML = `
            <img src="${iconURL}" alt="${fileExtension}">
            <div class="file-name">${fileName}</div>
            <button onclick="moveToBin('${file}')">Delete</button>
            <button onclick="editFileName('${file}')">Edit</button>
        `;
    fileContainer.appendChild(fileItem);
  });
}

function moveToBin(file) {
  confirmAction(`Are you sure you want to delete ${file}?`)
    .then(() => {
      files.splice(files.indexOf(file), 1);
      bin.push({ name: file, timeAdded: Date.now() });
      localStorage.setItem("bin", JSON.stringify(bin));
      displayFiles();
      displayBin();
      setTimeout(autoDelete, 30000, file); // Auto-delete after 30 seconds
    })
    .catch((error) => {
      alert(error);
    });
}

function editFileName(file) {
  const newFileName = prompt(
    "Enter new file name (without extension):",
    file.slice(0, file.lastIndexOf("."))
  );
  if (newFileName) {
    const fileExtension = file.slice(file.lastIndexOf("."));
    const newFile = `${newFileName}${fileExtension}`;
    files[files.indexOf(file)] = newFile;
    localStorage.setItem("fileHistory", JSON.stringify(files));
    displayFiles();
  }
}

function displayBin() {
  binContainer.innerHTML = "";
  bin.forEach((fileObj, index) => {
    const fileExtension = fileObj.name.slice(fileObj.name.lastIndexOf("."));
    const fileName = fileObj.name.slice(0, fileObj.name.lastIndexOf("."));
    const iconURL =
      fileIcons[fileExtension] || "https://via.placeholder.com/200?text=FILE";

    const binItem = document.createElement("div");
    binItem.className = "bin-item";
    binItem.innerHTML = `
            <img src="${iconURL}" alt="${fileExtension}">
            <div class="file-name">${fileName}</div>
            <button onclick="restoreFile(${index})">Restore</button>
            <button onclick="deleteFile(${index})">Delete</button>
        `;
    binContainer.appendChild(binItem);
  });
}

function deleteFile(index) {
  confirmAction("Are you sure you want to permanently delete this file?")
    .then(() => {
      bin.splice(index, 1);
      localStorage.setItem("bin", JSON.stringify(bin));
      displayBin();
    })
    .catch((error) => {
      alert(error);
    });
}

function clearAll() {
  confirmAction("Are you sure you want to clear all files in the bin?")
    .then(() => {
      bin = [];
      localStorage.setItem("bin", JSON.stringify(bin));
      displayBin();
    })
    .catch((error) => {
      alert(error);
    });
}

function autoDelete(file) {
  const fileIndex = bin.findIndex((f) => f.name === file);
  if (fileIndex !== -1 && Date.now() - bin[fileIndex].timeAdded >= 30000) {
    bin.splice(fileIndex, 1);
    localStorage.setItem("bin", JSON.stringify(bin));
    displayBin();
  }
}

function confirmAction(message) {
  return new Promise((resolve, reject) => {
    modalMessage.innerText = message;
    modal.style.display = "block";
    confirmBtn.onclick = () => {
      modal.style.display = "none";
      resolve("Confirmed");
    };
    cancelBtn.onclick = () => {
      modal.style.display = "none";
      reject("Cancelled");
    };
  });
}

displayFiles();
displayBin();
