import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ImageLightboxProps {
  imageUrl: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

const ImageLightbox = ({ imageUrl, alt, open, onClose }: ImageLightboxProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full p-0 overflow-hidden bg-black/95 border-none">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="relative w-full h-[90vh] flex items-center justify-center">
          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;