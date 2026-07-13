import { ImageOff } from 'lucide-react';
import { useObjectUrl } from '../hooks/useObjectUrl';

export default function ItemThumb({
  blob,
  alt,
}: {
  blob: Blob | undefined;
  alt: string;
}) {
  const url = useObjectUrl(blob);

  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center text-slate-300">
        <ImageOff size={20} />
      </div>
    );
  }

  return <img src={url} alt={alt} className="h-full w-full object-cover" />;
}
