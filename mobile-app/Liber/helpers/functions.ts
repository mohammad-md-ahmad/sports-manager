import RNFetchBlob from "rn-fetch-blob";

export const imageUrlToBase64 = async (imageUrl: string) => {
    try {
        const response = await RNFetchBlob.fetch('GET', imageUrl);
        const base64Data = response.base64();
        return `data:image/jpeg;base64,${base64Data}`;
    } catch (error) {
        console.error('Error fetching image:', error);
    }
};
