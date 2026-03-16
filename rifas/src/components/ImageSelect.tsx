import { useState, useRef } from 'react';
import { Upload, Image, X, CheckCircle2, AlertCircle, Trash } from 'lucide-react';
import { toast } from 'sonner';

const ImageSelect = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (selectedFile: File | undefined) => {
        setError('');
        
        if (!selectedFile) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Formato no válido. Usa JPG, PNG, GIF, o WEBP');
            toast.error('Formato de imagen no valido');
            return;
        }

        if (selectedFile.size > 3 * 1024 * 1024) {
            setError('El archivo es demasiado grande. Máximo 5MB');
            toast.error('Archivo demasiado grande');
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                setPreview(reader.result);
            }
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        handleFileChange(selectedFile);
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const droppedFile = e.dataTransfer.files?.[0];
        handleFileChange(droppedFile);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = () => {
        if (!file){
            return (
                <Upload className="w-12 h-12 text-neutral-700" />
            )
        }

        return (
            <Image className="w-12 h-12 text-neutral-700" />
        )
    };

    return (
        <div className="bg-neutral-300 p-4 rounded-lg w-full max-w-lg h-96 md:h-128">
            <div onClick={handleClick} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                className={`w-auto h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-4 p-6
                transition-all duration-200 cursor-pointer relative overflow-hidden group
                ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 
                    error ? 'border-red-500 bg-red-50' : 
                    file ? 'border-gray-500 bg-gray-50' : 'border-neutral-500 hover:border-neutral-700 hover:bg-neutral-400'
                }
                `}
            >
                <input ref={fileInputRef} type="file" onChange={handleInputChange} className="hidden" accept="image/*"/>

                {preview && (
                    <div className="absolute inset-0 w-full h-full">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover"/>
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-50 transition-opacity duration-200 flex items-center justify-center">
                            <span className="text-white"><Trash onClick={handleRemoveFile} className='size-8'/></span>
                        </div>
                    </div>
                )}

                {!preview && (
                    <>
                        <div className={`transition-transform duration-200 ${dragActive ? 'scale-110' : ''}`}>
                            {getFileIcon()}
                        </div>

                        <div className="text-center">
                            {!file ? (
                                <>
                                <p className="text-neutral-700 font-medium">
                                    {dragActive ? 'Suelta el archivo aquí' : 'Sube un archivo'}
                                </p>
                                <p className="text-neutral-600 text-sm mt-1">
                                    Arrastra o haz clic para seleccionar
                                </p>
                                </>
                            ) : (
                                <>
                                <p className="text-neutral-700 font-medium truncate max-w-50">
                                    {file.name}
                                </p>
                                <p className="text-neutral-500 text-sm mt-1">
                                    {formatFileSize(file.size)}
                                </p>
                                </>
                            )}
                        </div>

                        {/* Formatos soportados */}
                        {!file && !error && (
                        <p className="text-neutral-700 text-xs text-center">
                            JPG, PNG, GIF o WEBP (Máx. 3MB)
                        </p>
                        )}

                        {/* Mensaje de error */}
                        {error && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-100 px-3 py-1 rounded-full">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm">{error}</span>
                        </div>
                        )}

                        {/* Indicador de éxito */}
                        {file && !error && !preview && (
                        <div className="flex items-center gap-2 text-green-600 bg-green-100 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm">Archivo listo</span>
                        </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageSelect;