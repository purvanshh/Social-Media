import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import Image from 'next/image';

export default function Avatar({ size, url, editable, onChange }) {
  const supabase = useSupabaseClient();
  const session = useSession();
  const [imageUrl, setImageUrl] = useState(url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log("URL prop:", url);
    console.log("ImageUrl state:", imageUrl);
    if (url) setImageUrl(url);
  }, [url]);

  async function handleFileChange(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const newName = Date.now() + file.name;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(newName, file);

    if (error) {
      console.log(error);
    } else if (data) {
      const { publicUrl, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(newName);
      
      if (urlError) {
        console.log(urlError);
      } else {
        console.log("New image URL:", publicUrl);
        setImageUrl(publicUrl);
        if (onChange) onChange(publicUrl);
      }
    }
    setUploading(false);
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-full">
        <Image
          src={imageUrl || 'https://example.com/default-avatar.jpg'}
          alt=""
          width={size === 'big' ? 96 : 48}
          height={size === 'big' ? 96 : 48}
          className="rounded-full"
        />
      </div>
      {editable && (
        <label className="absolute bottom-0 right-0 shadow-md shadow-gray-500 p-2 bg-white rounded-full cursor-pointer">
          {uploading ? (
            <span>Uploading...</span>
          ) : (
            <>
              <input type="file" className="hidden" onChange={handleFileChange} />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </>
          )}
        </label>
      )}
    </div>
  );
}

console.log("Rendering with imageUrl:", imageUrl);
