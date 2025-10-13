import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  detailed_description?: string | null;
  price: number;
  image_url?: string | null;
}

interface MenuItemDialogProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

const MenuItemDialog = ({ item, open, onClose }: MenuItemDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{item.name}</DialogTitle>
          <DialogDescription className="text-lg font-semibold text-primary">
            {item.price.toFixed(2)}€
          </DialogDescription>
        </DialogHeader>

        {item.image_url && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          {item.description && (
            <p className="text-muted-foreground italic">{item.description}</p>
          )}
          
          {item.detailed_description && (
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{item.detailed_description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemDialog;