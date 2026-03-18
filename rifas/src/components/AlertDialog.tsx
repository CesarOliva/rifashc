import { Trash } from "lucide-react";
import { useRef } from "react";
import {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogTrigger,
    AlertDialogOverlay,
    AlertDialogTitle,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction
} from "./ui/alert-dialog"
import { toast } from "sonner";

interface RemoveDialogProps {
    onConfirm: () => Promise<void> | void;
    title?: string;
    description?: string;
}

const RemoveDialog = ({ 
    onConfirm,
    title = "¿Estás seguro?",
    description = "Esta acción no puede deshacerse. Se eliminará la rifa definitivamente."
}: RemoveDialogProps) => {
    const cancelRef = useRef<HTMLButtonElement>(null);

    const handleConfirm = async () => {
        try {
            Promise.resolve(onConfirm());
            
            cancelRef.current?.click();
        } catch (error) {
            console.error("Error:", error);
            cancelRef.current?.click();
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Trash className="size-6 cursor-pointer"/>
            </AlertDialogTrigger>
            
            <AlertDialogPortal>
                <AlertDialogOverlay className="bg-neutral-900/70 fixed inset-0" />

                <AlertDialogContent className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray-100 p-[25px] shadow-(--shadow-6) focus:outline-none">
                    <AlertDialogTitle className="m-0 text-[17px] text-black font-medium">
                        {title}
                    </AlertDialogTitle>
                    
                    <AlertDialogDescription className="mb-5 mt-[15px] text-[15px] text-black leading-normal">
                        {description}
                    </AlertDialogDescription>

                    <div className="flex justify-end gap-2">
                        <AlertDialogCancel ref={cancelRef}>
                            <div className="inline-flex h-[35px] items-center justify-center rounded-md bg-neutral-300 px-[15px] font-medium hover:bg-neutral-400 text-black cursor-pointer">
                                Cancelar
                            </div>
                        </AlertDialogCancel>
                        
                        <AlertDialogAction>
                            <div 
                                onClick={handleConfirm} 
                                className="inline-flex h-[35px] items-center justify-center rounded-md bg-black px-[15px] font-medium hover:bg-neutral-900 text-white cursor-pointer"
                            >
                                Sí, eliminar
                            </div>
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialogPortal>
        </AlertDialog>
    );
}

export default RemoveDialog;