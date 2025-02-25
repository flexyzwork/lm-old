const Footer = () => {
  return (
    <footer className="container mx-auto mt-16 py-6 text-center text-gray-500 dark:text-gray-400">
      <p className="text-sm">&copy; {new Date().getFullYear()} Flexyz. All rights reserved.</p>
      <nav className="mt-4 space-x-4">
        <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
        <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
        <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
      </nav>
    </footer>
  );
};

export default Footer;
