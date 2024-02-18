export const imageUrlToBase64 = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                let base64data = (reader.result || '').toString().replace('data:image/jpeg;base64,', ''); // Adjust based on image type

                if (!base64data.includes('data:image')) {
                    // Append 'data:image/png;base64,' (you can adjust the type accordingly)
                    base64data = `data:image/png;base64,${base64data}`;
                }

                resolve(base64data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image to base64:', error);
        throw error;
    }
};
