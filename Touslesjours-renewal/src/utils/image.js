export async function compressImage(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('JPEG, PNG, WebP 이미지만 선택해 주세요.');
 if(file.size>5*1024*1024)throw Error('이미지는 5MB 이하여야 합니다.');
 const bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas');canvas.width=canvas.height=256;
 const size=Math.min(bitmap.width,bitmap.height);canvas.getContext('2d').drawImage(bitmap,(bitmap.width-size)/2,(bitmap.height-size)/2,size,size,0,0,256,256);bitmap.close();
 const data=canvas.toDataURL('image/webp',.8);if(data.length*.75>500*1024)throw Error('압축한 이미지가 너무 큽니다. 다른 사진을 선택해 주세요.');return data;
}
export function imageFallback(event){const img=event.currentTarget;if(img.dataset.fallback)return;img.dataset.fallback='true';img.src='/images/placeholders/product-fallback.svg';}
