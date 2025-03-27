// https://en.wikipedia.org/wiki/List_of_file_signatures
const fileSignatures = {
    'png': [Uint8Array.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])],
    'jpeg': [Uint8Array.from([0xFF, 0xD8, 0xFF])],
    'webp': [Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50])]
    // Điền 0x00 vào các vị trí wildcard để tránh undefined
};

const compareSignature = (sig, actual) => {
    if (sig.length !== actual.length) return false;
    for (let i = 0, l = sig.length; i < l; i++) {
        if (sig[i] !== actual[i] && typeof sig[i] !== 'undefined') return false;
    }
    return true;
};

const matchesFileType = (uint8, type) => {
    const signatures = fileSignatures[type];
    for (let i = 0; i < signatures.length; i++) {
        if (compareSignature(signatures[i], uint8.slice(0, signatures[i].length))) {
            return true;
        }
    }
    return false;
};

const verifyFileType = (file, types, cb) => {
    const typeArray = typeof types === 'string' ? [types] : types;
    const bytesNeeded = Object.values(fileSignatures).reduce((prev, signatures) => {
        return Math.max(prev, signatures[0].length);
    }, 0);

    const reader = new FileReader();
    reader.onload = (e) => {
        const arrayBuffer = e.currentTarget.result;
        // Kiểm tra xem arrayBuffer có đủ byte không
        if (arrayBuffer.byteLength < bytesNeeded) {
            console.log("File too small to verify, rejecting:", file.name);
            cb(false); // File không đủ byte, coi như không hợp lệ
            return;
        }

        const bytes = new Uint8Array(arrayBuffer, 0, bytesNeeded);
        let match = false;
        for (let i = 0; i < typeArray.length; i++) {
            if (matchesFileType(bytes, typeArray[i])) {
                match = true;
                break;
            }
        }
        cb(match);
    };
    reader.readAsArrayBuffer(file);
};

window.FileDetector = { verifyFileType };
console.log("FileDetector is defined:", window.FileDetector);