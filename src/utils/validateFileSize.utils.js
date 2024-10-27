const MAX_SIZE_MB = 100;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export const validateFileSize = (file) => {
    if (!file) return false;

    const fileType = file.type.split('/')[0];
    if (fileType === 'image' || fileType === 'audio' || fileType === 'video') {
        return file.size <= MAX_SIZE_BYTES;
    } else {
        return false;
    }
};
