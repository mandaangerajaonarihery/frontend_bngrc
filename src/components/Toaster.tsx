import { Toaster as SonnerToaster } from 'sonner';

export const Toaster = () => {
    return (
        <SonnerToaster
            position="top-right"
            richColors
            closeButton
            expand={true}
            toastOptions={{
                style: {
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    fontFamily: 'inherit',
                },
                className: 'my-toast',
            }}
        />
    );
};
