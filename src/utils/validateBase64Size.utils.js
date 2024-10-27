const MAX_SIZE_MB = 100;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const validateBase64Size = (base64String) => {
    if (!base64String) return false;

    // Loại bỏ tiền tố "data:[mime-type];base64," nếu có
    const base64Data = base64String.split(',')[1] || base64String;

    // Tính toán kích thước của chuỗi base64
    const sizeInBytes =
        (base64Data.length * 3) / 4 -
        (base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0);

    return sizeInBytes <= MAX_SIZE_BYTES;
};
