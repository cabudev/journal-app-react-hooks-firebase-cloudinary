

export const fileUpload = async( file ) => {
    console.log(process.env.REACT_APP_CLOUDINARY_URL)
    //url cloudinary
    const cloudUrl = process.env.REACT_APP_CLOUDINARY_URL;

    const formData = new FormData();
    formData.append('upload_preset',process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append('file', file);
    
    try {
        const resp = await fetch( cloudUrl, {
            method: 'POST',
            body: formData
        });
        if(resp.ok){
            const cloudResp = await resp.json();
            return cloudResp.secure_url;
        } else {
            throw await resp.json();
        }
    } catch (error) {
        console.log(error);
    }
}