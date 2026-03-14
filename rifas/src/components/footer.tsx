const Footer = () => {
    return (
        <footer className="w-full bg-[#0f0f0f] pt-8 pb-12">
            <div className="flex flex-col items-center justify-between">
                <h3 className="text-3xl font-semibold text-[#f6d061] mb-4">CONTACTANOS</h3>
                <div className="flex space-x-8 mb-6">
                    <a target="_blank" href="https://www.facebook.com/profile.php?id=61587352149529">
                        <img className='size-10' src="/facebook.svg" alt="Facebook Rifas HC"/>
                    </a>
                    <a target="_blank" href="https://wa.me/+528673096867">
                        <img className='size-10' src="/whatsapp.svg" alt="WhatsApp Rifas HC"/>
                    </a>
                </div>
                <p className="text-lg text-center font-medium">&copy; 2026 Rifas HC. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
 
export default Footer;