export const formatTimestampToDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000); // Timestamp saniye cinsinden geldiği için 1000 ile çarpıyoruz
    return date.toLocaleDateString();
};