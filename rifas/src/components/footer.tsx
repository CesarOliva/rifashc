const Footer = () => {
    return (
        <footer className="w-full bg-neutral-800 pt-8 pb-12">
            <div className="flex flex-col items-center justify-between">
                <div className="flex space-x-8 mb-6">
                    <a target="_blank" href="https://www.facebook.com/profile.php?id=61587352149529">
                        <img className='size-10' src="/facebook.svg" alt="Facebook Rifas HC"/>
                    </a>
                    <a target="_blank" href="http://wa.me/8673096867">
                        <img className='size-10' src="/whatsapp.svg" alt="WhatsApp Rifas HC"/>
                    </a>
                </div>
                <p className="text-lg text-center font-medium">&copy; 2025 Rifas HC. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
 
export default Footer;